import {
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
} from "@react-navigation/bottom-tabs";
import {
  DefaultNavigatorOptions,
  DefaultRouterOptions,
  EventMapBase,
  NavigationState,
  ParamListBase,
  RouteConfig,
  RouteGroupConfig,
  StackNavigationState,
  TabNavigationState,
} from "@react-navigation/native";
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

export type ScreenConfig<K = string> = {
  name: K;
  component: React.ComponentType<any>;
  options?: RouterOptions;
  shouldRender?: boolean;
};

type State = NavigationState;
type ParamList = ParamListBase;
type ScreenOptions = {};
type EventMap = EventMapBase;

type RouterEventMap =
  | BottomTabNavigationEventMap
  | NativeStackNavigationEventMap;
type RouterOptions = BottomTabNavigationOptions | NativeStackNavigationOptions;
type RouterNavigationState =
  | TabNavigationState<ParamListBase>
  | StackNavigationState<ParamListBase>;

type RouterNavigationOptions = Omit<
  React.ComponentProps<React.ComponentType<any>>,
  keyof DefaultNavigatorOptions<any, any, any, any>
> &
  DefaultNavigatorOptions<ParamList, State, ScreenOptions, EventMap>;

export type RouterProps = {
  Group: React.ComponentType<RouteGroupConfig<ParamListBase, RouterOptions>>;
  Navigator: React.ComponentType<RouterNavigationOptions>;
  Screen: <RouteName extends string>(
    _: RouteConfig<
      ParamListBase,
      RouteName,
      RouterNavigationState,
      RouterOptions,
      RouterEventMap
    >
  ) => null;
};

const Stack = createNativeStackNavigator();

/**
 * Custom hook to dynamically render screens based on the provided configuration.
 * Filters out screens that have shouldRender set to false.
 *
 * @param screensConfig Array of screen configurations containing name, component, options, and shouldRender properties
 * @param Router RouterProps object containing Group, Navigator, and Screen components
 * @returns Rendered Navigator component with dynamically generated screens based on screensConfig
 */
export const useDynamicScreens = (
  screensConfig: ScreenConfig[],
  Router: RouterProps = Stack as unknown as RouterProps,
  navigatorOptions?: Omit<RouterNavigationOptions, "children">
) => {
  const screens = screensConfig.filter(
    (screen) => screen.shouldRender !== false
  );
  const Navigator = Router.Navigator;

  const Stacks = () => (
    <Navigator {...navigatorOptions}>
      {screens.map((screen) => (
        <Router.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Navigator>
  );

  return Stacks;
};
