/* global expect jest */

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from 'store';

import { Map } from './Map';
import mockNodes from '../../__mocks__/map-nodes';
import mockIntroNodes from '../../__mocks__/intro-nodes';
// eslint-disable-next-line max-len
import { CURRENT_CHALLENGE_KEY } from '../../templates/Challenges/redux/current-challenge-saga';

Enzyme.configure({ adapter: new Adapter() });
const renderer = new ShallowRenderer();

const baseProps = {
  introNodes: mockIntroNodes,
  nodes: mockNodes,
  toggleBlock: () => {},
  toggleSuperBlock: () => {}
};

test('<Map /> snapshot', () => {
  const componentToRender = (
    <Map
      introNodes={mockIntroNodes}
      nodes={mockNodes}
      toggleBlock={() => {}}
      toggleSuperBlock={() => {}}
    />
  );
  const component = renderer.render(componentToRender);
  expect(component).toMatchSnapshot('Map');
});

describe('<Map/>', () => {
  describe('after reload', () => {
    let initializeSpy = null;
    beforeEach(() => {
      initializeSpy = jest.spyOn(Map.prototype, 'initializeExpandedState');
    });
    afterEach(() => {
      initializeSpy.mockRestore();
      store.clearAll();
    });
    // 7 was chosen because it has a different superblock from the first node.
    const currentChallengeId = mockNodes[7].id;
    const anotherId = mockNodes[2].id;

    it('should expand the block with the most recent challenge', () => {
      const blockSpy = jest.fn();
      const superSpy = jest.fn();
      const props = {
        ...baseProps,
        toggleBlock: blockSpy,
        toggleSuperBlock: superSpy,
        currentChallengeId: currentChallengeId
      };
      const mapToRender = <Map {...props} />;
      shallow(mapToRender);
      expect(blockSpy).toHaveBeenCalledTimes(1);
      expect(blockSpy).toHaveBeenCalledWith(mockNodes[7].block);

      expect(superSpy).toHaveBeenCalledTimes(1);
      expect(superSpy).toHaveBeenCalledWith(mockNodes[7].superBlock);
    });

    it('should initialize if isInitialized is false', () => {
      const mapToRender = <Map {...baseProps} />;
      shallow(mapToRender);

      expect(initializeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not initialize if isInitialized is true', () => {
      const props = {
        ...baseProps,
        currentChallengeId: currentChallengeId,
        isInitialized: true
      };
      const mapToRender = <Map {...props} />;

      shallow(mapToRender);
      expect(initializeSpy).toHaveBeenCalledTimes(0);
    });

    it('should use the currentChallengeId prop if it exists', () => {
      const props = { ...baseProps, currentChallengeId };
      store.set(CURRENT_CHALLENGE_KEY, anotherId);
      const mapToRender = <Map {...props} />;
      shallow(mapToRender);

      expect(initializeSpy).toHaveBeenCalledTimes(1);
      expect(initializeSpy).toHaveBeenCalledWith(currentChallengeId);
    });

    it('should use storage if the prop is not set', () => {
      store.set(CURRENT_CHALLENGE_KEY, currentChallengeId);
      const mapToRender = <Map {...baseProps} />;
      shallow(mapToRender);

      expect(initializeSpy).toHaveBeenCalledTimes(1);
      expect(initializeSpy).toHaveBeenCalledWith(currentChallengeId);
    });

    it('should default to the first challenge otherwise', () => {
      const blockSpy = jest.fn();
      const superSpy = jest.fn();
      const props = {
        ...baseProps,
        toggleBlock: blockSpy,
        toggleSuperBlock: superSpy
      };
      const mapToRender = <Map {...props} />;
      shallow(mapToRender);
      expect(blockSpy).toHaveBeenCalledTimes(1);
      expect(blockSpy).toHaveBeenCalledWith(mockNodes[0].block);

      expect(superSpy).toHaveBeenCalledTimes(1);
      expect(superSpy).toHaveBeenCalledWith(mockNodes[0].superBlock);
    });
  });
});
