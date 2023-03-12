import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../pages/Register/Register.css';

import registerLogo from '../images/logo.svg';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { login } from '../store/action-creators/login-actions';

function Login(props) {
  const { resetErrors } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, errorMessage, formReset } = useAppSelector(
    (state) => state.authReducer
  );

  const [isName, setIsName] = useState('');
  const [values, setValues] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
  });
  const [inputEventTarget, setInputEventTarget] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  //Ввод данных и валидация
  const handleChange = (event) => {
    resetErrors();
    setInputEventTarget(event.target);
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setIsName(name);
    setValues({ ...values, [name]: value });
  };

  // Валидация email и password ----------------------------------------------
  useEffect(() => {
    if (values.email) {
      if (values.email.match(/^[\w]{1}[\w-.]*@[\w-]+\.[a-z]{2,4}$/i) === null) {
        setEmailValid({
          valid: false,
          message: 'Некорректный адрес электронной почты ',
        });
      } else {
        setEmailValid({ valid: true });
      }
    }
    if (inputEventTarget.name === 'password') {
      setPasswordValid(inputEventTarget.closest('input').checkValidity());
      setErrors({
        ...errors,
        [inputEventTarget.name]: inputEventTarget.validationMessage,
      });
    }
  }, [values]);

  // Переключение активности кнопки submit ---
  useEffect(() => {
    if (emailValid.valid && passwordValid) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailValid, passwordValid]);

  // Сброс -------------------------------
  useEffect(() => {
    if (formReset) {
      setValues({ email: '', password: '' });
      setErrors({});
      setDisabled(true);
    }
  }, [formReset]);

  useEffect(() => {
    user && navigate('/movies');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(values));

    setDisabled(false);
  };

  return (
    <div className='register'>
      <Link className='register__logo button-hover' to='/'>
        <img src={registerLogo} alt='Логотип' />
      </Link>

      <h2 className='register__title'>Рады видеть!</h2>

      <form className='register__form' onSubmit={handleSubmit}>
        <label className='register__label'>
          <span className='register__input-title'>E-mail</span>
          <input
            className='register__input register__input_type_email'
            id='email'
            type='email'
            onChange={handleChange}
            value={values.email ?? ''}
            placeholder='Email'
            name='email'
            required
          />
          {/* Показать ошибку валидации */}
          {isName === 'email' && (
            <span
              className='register__input-error'
              style={{ display: 'block' }}
            >
              {emailValid.message}
            </span>
          )}
        </label>
        <label className='register__label'>
          <span className='register__input-title'>Пароль</span>
          <input
            className='register__input register__input_type_password'
            id='password'
            type='password'
            onChange={handleChange}
            value={values.password ?? ''}
            placeholder='Пароль'
            name='password'
            minLength='6'
            required
          />
          {/* Показать ошибку валидации */}
          {isName === 'password' && (
            <span
              className='register__input-error'
              style={{ display: 'block' }}
            >
              {errors.password}
            </span>
          )}
        </label>
        <button
          className='register__submit register__submit-login button-hover'
          type='submit'
          disabled={disabled}
        >
          Войти
        </button>
      </form>
      <span className='register__error-login'>{errorMessage}</span>
      <div className='register__caption'>
        <span>Ещё не зарегистрированы?</span>
        <Link className='register__caption-link button-hover' to='/sign-up'>
          Регистрация
        </Link>
      </div>
    </div>
  );
}

export default Login;
