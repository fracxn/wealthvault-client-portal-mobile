// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Root reducer combining multiple slices
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Use AsyncStorage for React Native

const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Set storage to AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
