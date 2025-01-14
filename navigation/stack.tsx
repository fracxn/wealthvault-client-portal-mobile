

// import { useHasSeenOnboarding, useUser } from "store";
// import { RootStackType } from "./types";
// import { Onboarding } from "../features/onboarding";
// import { ScreenConfig, useDynamicScreens } from "../hooks/useNavigatorScreen";
// import { DashboardTab } from "./Tabs";
// import { useHasSeenOnboarding, useUser } from "../store";
// import { CheckEmail, DayOff, EarningsScreen, Login, SignUp, TimeOff, VerifyOtp } from "../features";
import { useAuthenticated } from "../hooks/useAuthentication";
import { ScreenConfig, useDynamicScreens } from "../hooks/useNavigatorScreen";
import SignInScreen from "../screens/auth/login";
import TwoFactorAuthScreen from "../screens/auth/TwoFactor";
import VerificationScreen from "../screens/auth/Verification";
import Dashboard from "../screens/dashboard";
import OnboardingScreen from "../screens/onboarding";
import { useHasSeenOnboarding, useUser } from "../store";
import routes from "./routes";
import { RootStackType } from "./types";

type ScreenNames = keyof RootStackType;

// const getSignedInUser = (user: User | null, userType: UserType) => user?.userType.toLowerCase() === userType


export const StackScreens = () => {
  const user = useUser();
  const isAuthenticated = useAuthenticated();
  const hasSeenOnboarding = useHasSeenOnboarding();
  
 
  
  const screens: ScreenConfig<ScreenNames>[] = [
    {
      name: "Onboarding",
      component: OnboardingScreen,

      shouldRender: !hasSeenOnboarding,
    },

    {
      name: routes.AUTH_SIGN_IN,
      component: SignInScreen,
      shouldRender: !isAuthenticated,
    },
    // {
    //   name: "CreateAccount",
    //   component: SignUp,
    //   shouldRender: !isAuthenticated,
    // },
    {
      name: routes.TWOFACTORAUTHSCREEN,
      component: TwoFactorAuthScreen,
      shouldRender: !isAuthenticated,
    },
    {
      name: routes.AUTH_VERIFICATION,
      component: VerificationScreen,
      shouldRender: !isAuthenticated,
    },
    {
      name: routes.DASHBOARD,
      component: Dashboard,
      shouldRender: isAuthenticated,
    },
    // {
    //   name: "ResetPassword",
    //   component: ResetPassword,
    //   shouldRender: !isAuthenticated,
    // },
    // {
    //   name: "Home",
    //   component: DashboardTab,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "Notifications",
    //   component: NotificationScreen,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "Earnings",
    //   component: EarningsScreen,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "Profile",
    //   component: ProfileScreen,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "LogDetails",
    //   component: LogDetails,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "TimeOff",
    //   component: TimeOff,
    //   shouldRender: isAuthenticated,
    // },
    // {
    //   name: "DayOff",
    //   component: DayOff,
    //   shouldRender: isAuthenticated,
    // },
  ];

  const Stacks = useDynamicScreens(screens, undefined, {
    id: "parent",
    screenOptions: {
      headerShown: false,
      contentStyle: { backgroundColor: "white" },
    },
  });

  return <Stacks />;
};
