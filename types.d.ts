import { AxiosResponse, AxiosError } from "axios";


type ApiError = {
    message: string;
    errorCode: number;
    errors: Record;
    error: string
};

type ApiResponse<T = unknown> = AxiosResponse<T>;
type ApiResponseError = AxiosError<ApiError>

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string| null;
    isEmailVerified: boolean;
    dob: string;
    zohoId: string;
    address: string|null;
    phone: string;
    country: string;
    status: "ACTIVE";
    twoFactorMethod: string[];
    interests: string[];
    adviser: {
        fullName: string;
        id: string| number;
        email: string;
        phone: string;
        avatar: string;
    };
    riskProfile: "High"|"Low";
    createdAt: string;
    updatedAt: string;
    __v: 0;
    goals: 
        {
            title: string;
            duration: string;
            strategy: string;
            position: 1;
        }[]
    
    riskRating: "High";
    IbAccount: null;
};