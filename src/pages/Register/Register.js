import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Register.css';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';

import registerLogo from '../../images/logo.svg';
import { registration } from '../../store/action-creators/register-actions';

function Register(props) {
  const { resetErrors } = props;
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { user, errorMessage, formReset } = useAppSelector(
    (state) => state.authReducer
  );

  const [isName, setIsName] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    password: '',
  });
  const [inputEventTarget, setInputEventTarget] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [nameValid, setNameValid] = useState(false);
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

  // Валидация name, email и password ----------------------------------------------
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
    if (inputEventTarget.name === 'name') {
      setNameValid(inputEventTarget.closest('input').checkValidity());
      setErrors({
        ...errors,
        [inputEventTarget.name]: inputEventTarget.validationMessage,
      });
    }
  }, [values]);

  // Переключение активности кнопки submit ---
  useEffect(() => {
    if (emailValid.valid && passwordValid && nameValid) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailValid, passwordValid]);

  // Сброс -------------------------------
  useEffect(() => {
    if (formReset) {
      setValues({ name: '', email: '', password: '' });
      setErrors({});
      setDisabled(true);
    }
  }, [formReset]);

  useEffect(() => {
    user && navigate('/movies');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registration(values));
    setDisabled(false);
  };

  return (
    <div className='register'>
      <Link className='register__logo button-hover' to='/'>
        <img src={registerLogo} alt='Логотип' />
      </Link>

      <h2 className='register__title'>Добро пожаловать!</h2>

      <form className='register__form' onSubmit={handleSubmit} noValidate>
        <label className='register__label'>
          <span className='register__input-title'>Имя</span>
          <input
            className='register__input register__input_type_name'
            id='name'
            type='text'
            onChange={handleChange}
            value={values.name ?? ''}
            placeholder='Имя'
            name='name'
            minLength='2'
            maxLength='30'
            required
          />
          {/* Показать ошибку валидации */}
          {isName === 'name' && (
            <span
              className='register__input-error'
              style={{ display: 'block' }}
            >
              {errors.name}
            </span>
          )}
        </label>
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
          className='register__submit button-hover'
          type='submit'
          // disabled={disabled}
        >
          Зарегистрироваться
        </button>
      </form>
      <span className='register__error'>{errorMessage}</span>
      <div className='register__caption'>
        <span>Уже зарегистрированы?</span>
        <Link className='register__caption-link button-hover' to='/sign-in'>
          Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;
