// import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackType = {
    Auth: {
        action?: string;
    };

    Splash: undefined;
    Onboarding: undefined;
    HomeScreen: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Two_factor_auth_screen: undefined;
    Dashboard: undefined;
    auth_verification: undefined;
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
} & { [key: string]: undefined }
    ;

export type RootStackScreenProps<T extends keyof RootStackType> =
    NativeStackScreenProps<RootStackType, T>;


//  type RootTabScreenProps<T extends keyof RootTabType> =
//     BottomTabScreenProps<RootTabType, T>;