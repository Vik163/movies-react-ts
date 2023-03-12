import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../utils/interfaces/IAuth';
import { IMovie } from '../../utils/interfaces/IMovies';

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  errorMessage: string;
  formReset: boolean;
  story: IMovie[] | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  errorMessage: '',
  formReset: false,
  story: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerRequest(state) {
      state.isLoading = true;
    },
    registerRequestSuccess(state, action: PayloadAction<IUser>) {
      state.isLoading = false;
      state.user = action.payload;
      state.errorMessage = '';
    },
    registerRequestFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.isLoading = false;
      state.formReset = true;
    },
    loginRequest(state) {
      state.isLoading = true;
    },
    loginRequestSuccess(state, action: PayloadAction<IUser>) {
      state.isLoading = false;
      state.user = action.payload;
      state.errorMessage = '';
    },
    loginRequestFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.isLoading = false;
      state.formReset = true;
    },
    logoutRequest(state) {
      state.isLoading = true;
    },
    logoutRequestSuccess(state) {
      state.isLoading = false;
      state.errorMessage = '';
      state.user = null;
    },
    logoutRequestFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export default authSlice.reducer;
