import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types
export type Navigation = NavigationProp<ParamListBase> & {
  setOptions: (options: Record<string, null | object | string | (() => JSX.Element)>) => void;
  reset: ({
    index,
    routes,
  }: { index: number, routes: [{ name: string }] }) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

// // Types
// export type Navigation = NavigationScreenProp<NavigationState, NavigationParams> & {
//   setOptions: (options: Record<string, null | object | string | (() => JSX.Element)>) => void;
//   reset: ({
//     index,
//     routes,
//   }: { index: number, routes: [{ name: string }] }) => void;
//   openDrawer: () => void,
//   closeDrawer: () => void,
// };


export type NavigationProps = {
  navigation: Navigation;
  route?: any;
  locationPermission?: any;
};
// export type NavigationProps = {
//   navigation: Navigation;
//   route?: RouteProp<ParamListBase, string>;
//   locationPermission?: any;
// };

export type RootStackParamList = {
  Auth: {
    action?: string;
  };
  Splash: undefined;
  Onboarding: undefined;
  HomeScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  // ClientProfileScreen: undefined;
  ClientScreen: undefined;
  AuthSignIn: undefined;
  AuthSignUp: undefined;
  Account: {
    type: string;
  };
  Search: {
    type: string;
  };
  SearchResult: undefined;
} & { [key: string]: undefined };

// export type ProfileScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'ClientProfileScreen'
// >;



export type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList
>;
