import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import moviesInitialReducer from './movies-initial-slice';
import moviesReducer from './movies-slice';
import userReducer from './user-slice';

export const rootReducer = combineReducers({
  authReducer,
  moviesInitialReducer,
  moviesReducer,
  userReducer,
});
