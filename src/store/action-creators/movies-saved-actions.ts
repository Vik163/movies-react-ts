import { mainApi } from '../../utils/mainApi';
import { moviesSlice } from '../reducers/movies-slice';
import { AppDispatch } from '../store';

export const getMoviesSaved = () => (dispatch: AppDispatch) => {
  dispatch(moviesSlice.actions.moviesSavedRequest());
  return mainApi
    .getSaveCards()
    .then((saveCards) => {
      if (saveCards) {
        dispatch(moviesSlice.actions.moviesSavedRequestSuccess(saveCards));
      }
      return saveCards;
    })
    .catch((err) => {
      dispatch(moviesSlice.actions.moviesSavedRequestFailed(err));
    });
};
