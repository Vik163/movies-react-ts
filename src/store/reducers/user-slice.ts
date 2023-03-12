import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../utils/interfaces/IAuth';

interface UserState {
  user: IUser | null;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  errorMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRequest(state) {
      state.isLoading = true;
    },
    userRequestSuccess(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isLoading = false;
      state.errorMessage = '';
    },
    userRequestFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.isLoading = false;
    },
  },
});

export default userSlice.reducer;
