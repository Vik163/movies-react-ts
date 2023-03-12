import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMovie } from '../../utils/interfaces/IMovies';

interface MoviesInitialState {
  errorMessage: string;
  isLoading: boolean;
}

const initialState: MoviesInitialState = {
  errorMessage: '',
  isLoading: false,
};

export const moviesInitialSlice = createSlice({
  name: 'moviesInitial',
  initialState,
  reducers: {},
});

export default moviesInitialSlice.reducer;
