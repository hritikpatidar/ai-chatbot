import { configureStore } from "@reduxjs/toolkit";
import Storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "../features/Auth/authSlice";
import chatSlice from '../features/Chat/chatSlice';
// import AdminDashboardSlice from '../features/Auth/authSlice'
import { thunk } from "redux-thunk";
const storage = Storage.default ?? Storage;

const authReducer = combineReducers({
  AuthSlice,
});

const AdminReducer = combineReducers({
  // AuthSlice,
});

const appReducer = combineReducers({
  authReducer,
  // AdminReducer,
  chatSlice,

  // writer: writerReducer,
  // assistant: assistantReducer,
});
// qa: persistReducer(qaPersistConfig, qaReducer),

const rootReducer = (state, action) => {
  if (action.type === "RESET") {
    state = undefined;
    // persistor.purge();  // Purge persisted data as well
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(
  { key: "root", version: 1, storage },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_PROTECTION === "developer" ? true : false,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false, // Disable serializable checks for redux-persist
  //     thunk,
  //   }),
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
export default store;
