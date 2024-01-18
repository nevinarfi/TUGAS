import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spacer } from '../helpers';

import ToggleButtonSetting from './toggle-button-setting';

type KeyboardShortcutsProps = {
  keyboardShortcuts: boolean;
  toggleKeyboardShortcuts: (sound: boolean) => void;
  explain?: string
};

export default function KeyboardShortcutsSettings({
  keyboardShortcuts,
  toggleKeyboardShortcuts,
  explanation = true
}: KeyboardShortcutsProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <ToggleButtonSetting
        action={t('settings.labels.keyboard-shortcuts')}
        explain={
          explanation
            ? 'Within a challenge, press ESC followed by SHIFT + ? to show a list of available shortcuts.'
            : ''
        }
        flag={keyboardShortcuts}
        flagName='keyboard-shortcuts'
        offLabel={t('buttons.off')}
        onLabel={t('buttons.on')}
        toggleFlag={() => {
          toggleKeyboardShortcuts(keyboardShortcuts ? false : true);
        }}
      />
      <Spacer size='medium'></Spacer>
    </>
  );
}

KeyboardShortcutsSettings.displayName = 'KeyboardShortcutsSettings';
