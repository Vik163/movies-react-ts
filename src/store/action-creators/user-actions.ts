import { mainApi } from '../../utils/mainApi';
import { userSlice } from '../reducers/user-slice';
import { AppDispatch } from '../store';

export const getUser = () => (dispatch: AppDispatch) => {
  dispatch(userSlice.actions.userRequest());
  return mainApi
    .getUserInfo()
    .then((userData) => {
      if (userData) {
        dispatch(userSlice.actions.userRequestSuccess(userData));
      }
      return userData;
    })
    .catch((err) => {
      dispatch(userSlice.actions.userRequestFailed(err));
    });
};
