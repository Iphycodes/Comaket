import { AnyAction, configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import logger from 'redux-logger';
import appReducer from './slices';
import { api } from '@grc/services/api';
import { appMiddleware } from '@grc/services/ui';
import storage from 'redux-persist/lib/storage';
import { logout, logoutMiddleware } from './slices/auth';

const persistConfig = {
  key: 'giro',
  storage,
  whitelist: ['auth'],
};

export const persistedReducer = persistReducer(persistConfig, appReducer);

const rootReducer = (state: ReturnType<typeof persistedReducer> | undefined, action: AnyAction) => {
  if (action.type === logout.type) {
    return persistedReducer(undefined, action);
  }
  return persistedReducer(state, action);
};

const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, PAUSE, REHYDRATE, PURGE, PERSIST, REGISTER],
        },
      }).concat([api.middleware, logger, appMiddleware, logoutMiddleware]),
    ...options,
  });
export const store = createStore();
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//wrapper for next
export type AppStore = ReturnType<typeof createStore>;
