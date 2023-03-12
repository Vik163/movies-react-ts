import { moviesApi } from '../../utils/moviesApi';
import { moviesSlice } from '../reducers/movies-slice';
import { AppDispatch } from '../store';

export const getMoviesInitial = () => (dispatch: AppDispatch) => {
  dispatch(moviesSlice.actions.moviesInitialRequest());
  moviesApi
    .getCards()
    .then((cards) => {
      dispatch(moviesSlice.actions.moviesInitialRequestSuccess(cards));
      localStorage.setItem('initialCards', JSON.stringify(cards));
    })
    .catch((err) => {
      dispatch(moviesSlice.actions.moviesInitialRequestFailed(err));
      console.log(err);
    });
};
