import React from 'react';
// import { Platform } from 'react-native';
import { StatusBarProps as EXStatusBarProps, StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { Colors } from '../../theme';

type StatusBarProps = {
  style?: 'light' | 'dark' | 'inverted';
  translucent?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
} & EXStatusBarProps;

const StatusBar = ({
  style = 'dark',
  translucent = true,
  transparent = true,
  backgroundColor = Colors.Primary.GREEN,
  ...rest
}: StatusBarProps): JSX.Element => (
  <ExpoStatusBar
    style={style}
    animated
    translucent={translucent}
    backgroundColor={transparent ? 'transparent' : backgroundColor}
    {...rest}
  />
);

export default StatusBar;
