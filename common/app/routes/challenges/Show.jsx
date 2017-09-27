import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { challengeMetaSelector } from './redux';

import CompletionModal from './Completion-Modal.jsx';
import Classic from './views/classic';
import Step from './views/step';
import Project from './views/project';
import BackEnd from './views/backend';
import Quiz from './views/quiz';

import {
  updateTitle,
  updateCurrentChallenge,
  fetchChallenge,

  challengeSelector
} from '../../redux';
import { makeToast } from '../../Toasts/redux';
import { paramsSelector } from '../../Router/redux';

const views = {
  backend: BackEnd,
  classic: Classic,
  project: Project,
  simple: Project,
  step: Step,
  quiz: Quiz
};

const mapDispatchToProps = {
  fetchChallenge,
  makeToast,
  updateCurrentChallenge,
  updateTitle
};

const mapStateToProps = createSelector(
  challengeSelector,
  challengeMetaSelector,
  paramsSelector,
  (
    { dashedName, isTranslated },
    { viewType, title },
    params,
  ) => ({
    challenge: dashedName,
    isTranslated,
    params,
    title,
    viewType
  })
);

const link = 'http://forum.freecodecamp.org/t/' +
  'guidelines-for-translating-free-code-camp' +
  '-to-any-language/19111';

const propTypes = {
  areChallengesLoaded: PropTypes.bool,
  isStep: PropTypes.bool,
  isTranslated: PropTypes.bool,
  makeToast: PropTypes.func.isRequired,
  params: PropTypes.shape({
    block: PropTypes.string,
    dashedName: PropTypes.string,
    lang: PropTypes.string.isRequired
  }),
  title: PropTypes.string,
  updateCurrentChallenge: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  viewType: PropTypes.string
};

export class Show extends PureComponent {

  componentWillMount() {
    const { params: { lang }, isTranslated, makeToast } = this.props;
    if (lang !== 'en' && !isTranslated) {
      makeToast({
        message: 'We haven\'t translated this challenge yet.',
        action: <a href={ link } target='_blank'>Help Us</a>,
        timeout: 15000
      });
    }
  }

  componentDidMount() {
    if (this.props.title) {
      this.props.updateTitle(this.props.title);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title } = nextProps;
    const { lang, dashedName } = nextProps.params;
    const { isTranslated } = nextProps;
    const { updateTitle, updateCurrentChallenge, makeToast } = this.props;
    if (this.props.params.dashedName !== dashedName) {
      updateCurrentChallenge(dashedName);
      updateTitle(title);
      if (lang !== 'en' && !isTranslated) {
        makeToast({
          message: 'We haven\'t translated this challenge yet.',
          action: <a href={ link } target='_blank'>Help Us</a>,
          timeout: 15000
        });
      }
    }
  }

  render() {
    const { viewType } = this.props;
    const View = views[viewType] || Classic;
    return (
      <div>
        <View />
        <CompletionModal />
      </div>
    );
  }
}

Show.displayName = 'Show(ChallengeView)';
Show.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Show);
