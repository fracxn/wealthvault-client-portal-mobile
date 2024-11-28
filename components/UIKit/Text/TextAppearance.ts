import { StyleSheet } from 'react-native';

import { Colors, Layout } from '../../../theme';

// font styles, not stylesheet
export const FontStyles = {
  Text: {
    BOLD: 'text:bold', //               700
    // SEMIBOLD: 'text:semibold', //       600
    MEDIUM: 'text:medium', //           500
    REGULAR: 'text', //                 400
    LIGHT: 'text:light', //             300
    MONO: 'text:mono', //   300
  },
};

export const FontStyleFontFamily = {
  Text: {
    // EXTRABOLD: 'Poppins-ExtraBold',
    BOLD: 'Poppins-Bold',
    // SEMIBOLD: 'Poppins-SemiBold',
    MEDIUM: 'Poppins-Medium',
    REGULAR: 'Poppins-Regular',
    LIGHT: 'Poppins-Light',
    MONO: 'ArialMono-Regular',
  },
};

// font family style
export const fontStyleStyles = StyleSheet.create({
  // [FontStyles.Text.EXTRABOLD]: { fontFamily: FontStyleFontFamily.Text.EXTRABOLD },
  [FontStyles.Text.BOLD]: { fontFamily: FontStyleFontFamily.Text.BOLD },
  // [FontStyles.Text.SEMIBOLD]: { fontFamily: FontStyleFontFamily.Text.SEMIBOLD },
  [FontStyles.Text.MEDIUM]: { fontFamily: FontStyleFontFamily.Text.MEDIUM },
  [FontStyles.Text.REGULAR]: { fontFamily: FontStyleFontFamily.Text.REGULAR },
  [FontStyles.Text.LIGHT]: { fontFamily: FontStyleFontFamily.Text.LIGHT },
  [FontStyles.Text.MONO]: { fontFamily: FontStyleFontFamily.Text.MONO },
});

export const styles = StyleSheet.create({
  default: { fontSize: Layout.FSV_15, fontFamily: FontStyleFontFamily.Text.REGULAR },
  dark: { color: Colors.Primary.WHITE },
  light: { color: Colors.Primary.REGULAR },
});
