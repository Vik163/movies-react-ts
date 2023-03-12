import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMovie } from '../../utils/interfaces/IMovies';
import { IStoryMovies } from '../../utils/interfaces/IStoryMovies';

interface MoviesState {
  moviesInitial: IMovie[] | null;
  movies: IMovie[] | null;
  moviesSaved: IMovie[] | null;
  initialMoviesSaved: IMovie[] | null;
  storyMovies: IStoryMovies | {};
  storySavedMovies: IStoryMovies | {};
  isLoading: boolean;
  errorMessage: string;
}

const initialState: MoviesState = {
  movies: null,
  moviesInitial: null,
  moviesSaved: [],
  initialMoviesSaved: [],
  storyMovies: {},
  storySavedMovies: {},
  isLoading: false,
  errorMessage: '',
};

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    moviesInitialRequest(state) {
      state.isLoading = true;
    },
    moviesInitialRequestSuccess(state, action: PayloadAction<IMovie[]>) {
      state.moviesInitial = action.payload;
      state.errorMessage = '';
      state.isLoading = false;
    },
    moviesInitialRequestFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.isLoading = false;
    },
    moviesSavedRequest(state) {
      state.isLoading = true;
    },
    moviesSavedRequestSuccess(state, action: PayloadAction<IMovie[]>) {
      state.moviesSaved = action.payload;
      state.isLoading = false;
      state.errorMessage = '';
    },
    moviesSavedRequestFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    setMovies(state, action: PayloadAction<IMovie[]>) {
      state.movies = action.payload;
    },
    setSaveMovies(state, action: PayloadAction<IMovie[]>) {
      state.moviesSaved = action.payload;
    },
    setInitialSaveMovies(state, action: PayloadAction<IMovie[]>) {
      state.initialMoviesSaved = action.payload;
    },
    setStoryMovies(state, action: PayloadAction<IStoryMovies>) {
      state.storyMovies = action.payload;
    },
    setStorySavedMovies(state, action: PayloadAction<IStoryMovies>) {
      state.storySavedMovies = action.payload;
    },
  },
});

export const {
  setMovies,
  setSaveMovies,
  setInitialSaveMovies,
  setStoryMovies,
  setStorySavedMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;
