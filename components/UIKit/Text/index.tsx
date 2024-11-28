import * as React from 'react';
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
} from 'react-native';
import { Layout } from '../../../theme';

import { fontStyleStyles, styles } from './TextAppearance';

type TTextProps = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  appearance?: string;
  context?: 'dark' | 'light';
  fontStyle?: 'text:bold'
    | 'text:medium'
    | 'text'
    | 'text:light'
    | 'text:mono';
} & TextProps;

const Text = ({
  children,
  style,
  appearance = 'default',
  context = 'light',
  fontStyle = 'text:medium',
  ...props
}: TTextProps) : JSX.Element => {
  const targetStyles = style && Array.isArray(style) ? StyleSheet.flatten(style) : style;

  // Renders
  return (
    <RNText
      allowFontScaling={false}
      {...props}
      style={[
        // { top: Platform.select({ ios: 0, android: scale(1.5) }) },
        context === 'dark' ? styles.dark : styles.light,
        fontStyle ? { ...fontStyleStyles[fontStyle] } : null,
        { lineHeight: targetStyles?.fontSize ? targetStyles.fontSize + Layout.SV_5 : Layout.SV_24 },
        targetStyles,
      ]}
    >
      {children}
    </RNText>
  );
};

export default Text;
