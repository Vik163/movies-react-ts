import { auth } from '../../utils/authApi';
import { authSlice } from '../reducers/auth-slice';
import { AppDispatch } from '../store';

export const logout = () => (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  auth
    .logout()
    .then((data) => {
      if (data) {
        dispatch(authSlice.actions.logoutRequestSuccess());
        localStorage.removeItem('token');
        localStorage.removeItem('saveCards');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('initialCards');
      }
    })
    .catch((err) => {
      dispatch(authSlice.actions.logoutRequestFailed(err));

      console.log(err);
    });
};
