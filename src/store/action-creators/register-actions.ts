import { auth } from '../../utils/authApi';
import { IAuthorization } from '../../utils/interfaces/IAuth';
import { authSlice } from '../reducers/auth-slice';
import { AppDispatch } from '../store';

export const registration =
  ({ name, email, password }: IAuthorization) =>
  (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.registerRequest());
    auth
      .registration(name, password, email)
      .then((res) => {
        if (res) {
          dispatch(authSlice.actions.registerRequestSuccess(res));
          localStorage.setItem('loggedIn', 'true');
        }
      })
      .catch((err) => {
        dispatch(authSlice.actions.registerRequestFailed(err.message));
        // setFormReset(true);
        // err.message === 'Ошибка: Bad Request'
        //   ? setErrorMessage('При регистрации пользователя произошла ошибка')
        //   : handleErrors(err);
      });
  };
