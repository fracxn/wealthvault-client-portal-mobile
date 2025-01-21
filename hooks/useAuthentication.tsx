import { useAccessToken, useUser } from "../store";


export const useAuthenticated = () => {
  const token = useAccessToken();
  const user = useUser();

  return typeof token === "string" && user !== null;
};
