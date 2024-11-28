import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Button, Button as PPButton} from 'react-native-paper';

import { fontStyleStyles } from './Text/TextAppearance';
import { Colors, Layout } from '../../theme';
import { ScreenSize } from '../../utils';

type ButtonProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  labelFontStyle?: 'text:extrabold'
  | 'text:bold'
  | 'text:semibold'
  | 'text:medium'
  | 'text'
  | 'text:light';
  contentStyle?: StyleProp<TextStyle & ViewStyle>;
  buttonColor?: string;
  mode?: 'text' | 'contained' | 'outlined';
  icon?: string | any;
  compact?: boolean;
  uppercase?: boolean;
  dark?: boolean;
  loading?: boolean;
  bottomOffset?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  rounded?: false;
  thin?: boolean;
  removeMarginTop?: boolean;
};

const TouchableRipple = ({
  style = undefined,
  labelStyle = undefined,
  labelFontStyle = 'text:extrabold',
  contentStyle = undefined,
  icon = undefined,
  buttonColor,
  mode = 'outlined',
  compact = false,
  uppercase = false,
  thin = false,
  rounded = false,
  dark = true,
  onPress = undefined,
  onLongPress = undefined,
  loading = false,
  bottomOffset = false,
  disabled = false,
  removeMarginTop = false,
  children,
  // theme,
  ...rest
}: ButtonProps): JSX.Element => (
  <PPButton
    style={[
      styles.container,
      bottomOffset && styles.containerWithBottomOffset,
      rounded && styles.containerRounded,
      style,
    ]}
    labelStyle={[
      styles.label,
      labelFontStyle && fontStyleStyles[labelFontStyle],
      labelStyle,

    ]}

    // buttonColor={mode === 'outlined' ? Colors.Primary.WHITE : Colors.Primary.REGULAR }
    mode={mode}
    icon={icon}
    compact={compact}
    contentStyle={[[
      styles.content,
      thin && styles.contentThin,
      // rounded && styles.contentRounded,
      contentStyle,
    ]]}
    uppercase={uppercase}
    dark={dark}
    loading={loading}
    onPress={onPress}
    onLongPress={onLongPress}
    disabled={disabled}
    {...rest}
  >
    {children}
  </PPButton>

);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    shadowRadius: 0,
    elevation: 0,
    borderRadius:Layout.SV_10,
    borderColor: Colors.Primary.GREY_3,
    margin: Layout.SV_4
  },
  containerDropShadow: {
    shadowColor: Colors.Primary.BLACK,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.30,
    shadowRadius: 5,

    elevation: 5,
  },
  containerWithBottomOffset: {
    marginBottom: Layout.SV_20,

  },
  containerRounded: {
    borderRadius: Layout.SV_60,
    overflow: 'hidden',
  },
  contentThin: {
    height: Layout.SV_34,
  },
  content: {
    height: Layout.SV_42,
    // borderColor: Colors.Primary.WHITE,
    // borderRadius: Layout.SV_1,
  },
  contentRounded: {
    // borderRadius: Layout.SV_1,
  },

  label: {
    letterSpacing: 0.2,
    fontWeight: '700',
    // top: -2,
    fontSize: ScreenSize.SCREEN_WIDTH <= 375 ? Layout.FSV_8 : Layout.FSV_12,
  },
});

export default TouchableRipple;
