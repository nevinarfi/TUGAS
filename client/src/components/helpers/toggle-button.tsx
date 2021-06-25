import React, { Fragment } from 'react';
import {
  ToggleButtonGroup as BSBG,
  ToggleButton as TB
} from '@freecodecamp/react-bootstrap';

import './toggle-button.css';
import ToggleCheck from '../../assets/icons/toggle-check';
import Spacer from '../../assets/icons/spacer';

interface ButtonProps {
  name: string;
  offLabel: string;
  onChange: (value: string) => void;
  onLabel: string;
  value: boolean;
  condition?: boolean;
}

type ActiveClass = Pick<ButtonProps, 'condition'>;

function getActiveClass(condition: ActiveClass | unknown) {
  return condition ? 'active' : 'not-active';
}

export default function ToggleButton({
  name,
  onChange,
  value,
  onLabel = 'On',
  offLabel = 'Off'
}: ButtonProps): JSX.Element {
  const checkIconStyle = {
    height: '15px',
    width: '20px'
  };
  return (
    <Fragment>
      <BSBG name={name} onChange={onChange} type='radio'>
        <TB
          bsSize='sm'
          bsStyle='primary'
          className={`toggle-${getActiveClass(value)}`}
          disabled={value}
          type='radio'
          value={1}
        >
          {value ? (
            <ToggleCheck style={checkIconStyle} />
          ) : (
            <Spacer style={checkIconStyle} />
          )}
          {onLabel}
        </TB>
        <TB
          bsSize='sm'
          bsStyle='primary'
          className={`toggle-${getActiveClass(!value)}`}
          disabled={!value}
          type='radio'
          value={2}
        >
          {offLabel}
          {!value ? (
            <ToggleCheck style={checkIconStyle} />
          ) : (
            <Spacer style={checkIconStyle} />
          )}
        </TB>
      </BSBG>
    </Fragment>
  );
}

ToggleButton.displayName = 'ToggleButton';
