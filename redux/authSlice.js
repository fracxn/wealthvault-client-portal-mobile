// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  expiryTime: null,
  refreshToken: null,
  method: null,
  twoFaRequired: false,
  twoFaMethods: [],
  twoFaRecipient: null,
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { accessToken, expiryTime, refreshToken, method } = action.payload;
      state.accessToken = accessToken;
      state.expiryTime = expiryTime;
      state.refreshToken = refreshToken;
      state.method = method;
    },
    setTwoFA: (state, action) => {
      const { methods, recipient } = action.payload;
      state.twoFaRequired = true;
      state.twoFaMethods = methods;
      state.twoFaRecipient = recipient;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.expiryTime = null;
      state.refreshToken = null;
      state.method = null;
      state.twoFaRequired = false;
      state.twoFaMethods = [];
      state.twoFaRecipient = null;
      state.currentUser = null;
    },
  },
});

export const { setAuth, setTwoFA, setCurrentUser, clearAuth } = authSlice.actions;

// Thunk to handle async login/2FA verification and store token
export const handleLoginSuccess = (authData) => async (dispatch) => {
  try {
    const { accessToken, expiryTime, refreshToken, method, currentUser } = authData;
    await AsyncStorage.setItem('accessToken', accessToken); 
    dispatch(setAuth({ accessToken, expiryTime, refreshToken, method, currentUser }));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};
export default authSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   accessToken: null,
//   expiryTime: null,
//   refreshToken: null,
//   method: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setAuth: (state, action) => {
//       const { accessToken, expiryTime, refreshToken, method } = action.payload;
//       state.accessToken = accessToken;
//       state.expiryTime = expiryTime;
//       state.refreshToken = refreshToken;
//       state.method = method;
//     },
//     clearAuth: (state) => {
//       state.accessToken = null;
//       state.expiryTime = null;
//       state.refreshToken = null;
//       state.method = null;
//     },
//   },
// });

// export const { setAuth, clearAuth } = authSlice.actions;
// export default authSlice.reducer;
