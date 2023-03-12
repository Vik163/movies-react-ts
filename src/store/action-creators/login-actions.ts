import { auth } from '../../utils/authApi';
import { IAuthorization } from '../../utils/interfaces/IAuth';
import { authSlice } from '../reducers/auth-slice';
import { AppDispatch } from '../store';

export const login =
  ({ password, email }: IAuthorization) =>
  (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.loginRequest());
    auth
      .authorization(password, email)
      .then((data) => {
        dispatch(authSlice.actions.loginRequestSuccess(data));
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('loggedIn', 'true');
        // setCurrentUser(data.user);
        // setErrorMessage('');
      })
      .catch((err) => {
        dispatch(authSlice.actions.loginRequestFailed(err.message));
        // setFormReset(true);
        // err.message === 'Ошибка: Bad Request'
        //   ? setErrorMessage('При авторизации пользователя произошла ошибка')
        //   : handleErrors(err);
        // console.log(err);
      });
  };
