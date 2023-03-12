import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import './App.css';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';

import Login from '../../pages/Login.js';
import Register from '../../pages/Register/Register.js';
import Profile from '../../pages/Profile/Profile.js';
import ErrorPage from '../../pages/error/ErrorPage.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import Main from '../Main/Main.js';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies';
import errorHandler from '../ErrorHandler';

import ProtectedRoute from '../ProtectedRoute';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { mainApi } from '../../utils/mainApi.js';
import { moviesApi } from '../../utils/moviesApi.js';
import { auth } from '../../utils/authApi.js';
import { getMoviesInitial } from '../../store/action-creators/movies-actions';
import { getUser } from '../../store/action-creators/user-actions';
import { getMoviesSaved } from '../../store/action-creators/movies-saved-actions';
import {
  setMovies,
  setSaveMovies,
  setInitialSaveMovies,
  setStoryMovies,
  setStorySavedMovies,
} from '../../store/reducers/movies-slice';

function App() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  console.log(pathname);
  const { user, moviesInitial, saveCards } = useAppSelector((state) => ({
    user: state.userReducer.user,
    moviesInitial: state.moviesReducer.moviesInitial,
    saveCards: state.moviesReducer.moviesSaved,
  }));
  // console.log(user);
  const [currentUser, setCurrentUser] = useState({});
  // console.log(currentUser);
  const navigate = useNavigate();

  const [formReset, setFormReset] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [errorPageMessage, setErrorPageMessage] = useState('');
  const [preloaderMessage, setPreloaderMessage] = useState('');
  const [isPreloader, setIsPreloader] = useState(false);
  const [initialSavedCards, setInitialSavedCards] = useState([]);
  const [story, setStory] = useState(false);
  const [storySavePage, setStorySavePage] = useState({});
  const [cards, setCards] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const initialCards = JSON.parse(localStorage.getItem('initialCards'));
  const storySaveCards = JSON.parse(localStorage.getItem('saveCards'));
  const loggedIn = JSON.parse(localStorage.getItem('loggedIn'));

  function handleErrors(error) {
    // if (error.response) {
    //   // Запрос был сделан, и сервер ответил кодом состояния, который
    //   // выходит за пределы 2xx
    //   // console.log(error.response.data);
    //   // console.log(error.response.status);
    //   // console.log(error.response.headers);
    // } else if (error.request) {
    //   // Запрос был сделан, но ответ не получен
    //   // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
    //   // http.ClientRequest в node.js
    //   // console.log(error.request);
    // } else {
    //   // Произошло что-то при настройке запроса, вызвавшее ошибку
    //   // console.log('Error', error.message);
    // }
    // // console.log(error.config);
    // throw new Error(`Ошибка: ${error.response.status}`);
  }

  // Получение карт пользователя и его данных =====================
  useEffect(() => {
    Promise.all([dispatch(getUser()), dispatch(getMoviesSaved())])
      .then(([userData, saveCards]) => {
        setCurrentUser(userData);
        dispatch(setInitialSaveMovies(saveCards));
        dispatch(setSaveMovies(saveCards));
      })
      .catch((err) => handleErrors(err));
  }, []);

  useEffect(() => {
    pathname === '/saved-movies' && dispatch(setMovies(saveCards));
  }, [saveCards]);

  // Получение первоначальных карт --------------------------------
  useEffect(() => {
    if (loggedIn) {
      if (!initialCards) {
        dispatch(getMoviesInitial());
      } else {
        if (!storySaveCards) {
          // Отсутствует история
          dispatch(setMovies(initialCards));
        } else {
          dispatch(setMovies(storySaveCards.arr)); // Есть история
          dispatch(setStoryMovies(storySaveCards));
          // setStory(storySaveCards);
        }
      }
    }
  }, [loggedIn]);

  // Карты пользователя --------------
  useEffect(() => {
    dispatch(setSaveMovies(initialSavedCards));
    // setSavedCards(initialSavedCards);
  }, [initialSavedCards]);

  // получение первоначальных карт при пустом инпуте поиска фильмов
  function getInitialCards() {
    if (loggedIn) {
      setIsPreloader(false);
      dispatch(setMovies(initialCards));
    }
  }

  // получение первоначальных карт пользователя
  function getInitialSaveCards() {
    if (loggedIn) {
      setIsPreloader(false);
      setSavedCards(initialSavedCards);
      setStorySavePage({});
    }
  }

  // Обновление пользователя -------------------------
  function handleUpdateUser(obj) {
    mainApi
      .sendInfoProfile(obj)
      .then((result) => {
        console.log(result);
        setCurrentUser(result);
        setErrorMessage('Данные успешно обновлены! ');
      })
      .catch((err) => {
        err.message === 'Ошибка: Bad Request'
          ? setErrorMessage('При обновлении профиля произошла ошибка')
          : handleErrors(err);
        console.log(err);
      });
  }

  // //Сортировка отправки ошибок
  // function handleErrors(err) {
  //   if (
  //     err.message === 'Ошибка: 404' ||
  //     err.message === 'Ошибка: Internal Server Error' ||
  //     err.message === 'Failed to fetch'
  //   ) {
  //     setErrorPageMessage(errorHandler(err));
  //     navigate('*');
  //   }
  //   setErrorMessage(errorHandler(err));
  // }

  //Поиск в несохраненных картах
  function searchCards(value, isToggle) {
    setIsPreloader(true);

    if (initialCards) {
      const arr = initialCards.filter((item) => {
        if (item.nameRU && item.nameEN) {
          if (isToggle) {
            //Переключатель - короткометражки
            if (item.duration < 40) {
              return (
                item.nameRU.toLowerCase().includes(value.toLowerCase()) ||
                item.nameEN.toLowerCase().includes(value.toLowerCase())
              );
            }
          } else {
            return (
              item.nameRU.toLowerCase().includes(value.toLowerCase()) ||
              item.nameEN.toLowerCase().includes(value.toLowerCase())
            );
          }
        }
      });
      if (!(arr.length === 0)) {
        setIsPreloader(false);
        dispatch(setMovies(arr));
        // История поиска
        localStorage.setItem(
          'saveCards',
          JSON.stringify({
            isToggle: isToggle,
            value: value,
            arr: arr,
          })
        );
        // строка в объект + рендер ------------------------------
        dispatch(setStoryMovies(JSON.parse(localStorage.getItem('saveCards'))));
        // setStory(JSON.parse(localStorage.getItem('saveCards')));
      } else {
        setPreloaderMessage('Ничего не найдено');
      }
    }
  }

  //Поиск сохраненных карт
  function searchSaveCards(value, isToggle) {
    setIsPreloader(true);

    const arr = initialSavedCards.filter((item) => {
      if (item.nameRU && item.nameEN) {
        if (isToggle) {
          if (item.duration < 40) {
            return (
              item.nameRU.toLowerCase().includes(value.toLowerCase()) ||
              item.nameEN.toLowerCase().includes(value.toLowerCase())
            );
          }
        } else {
          return (
            item.nameRU.toLowerCase().includes(value.toLowerCase()) ||
            item.nameEN.toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    });
    if (!(arr.length === 0)) {
      setIsPreloader(false);
      dispatch(setSaveMovies(arr));
      // setSavedCards(arr);
      dispatch(
        setStorySavedMovies({
          isToggle: isToggle,
          value: value,
          arr: arr,
        })
      );
      // setStorySavePage({
      //   isToggle: isToggle,
      //   value: value,
      //   arr: arr,
      // });
    } else {
      setPreloaderMessage('Ничего не найдено');
    }
  }

  //Отбор короткометражек
  function searchShortCards(isToggle, pageSaveMovies) {
    setIsPreloader(true);

    // Выбор массива карт ------------------------------------
    const arrCards = pageSaveMovies ? savedCards : initialCards;

    // Обновление в истории состояния переключателя короткометражек
    pageSaveMovies
      ? setStorySavePage({ ...storySavePage, isToggle: isToggle })
      : setStory({ ...story, isToggle: isToggle });

    if (isToggle) {
      // Короткометражки
      const arr = arrCards.filter((item) => {
        return item.duration < 40;
      });
      if (!(arr.length === 0)) {
        setIsPreloader(false);
        pageSaveMovies ? setSavedCards(arr) : setCards(arr);
      } else {
        setPreloaderMessage('Ничего не найдено');
      }
    } else {
      setIsPreloader(false);
      // Обновление фильмов в истории
      story.arr ? setCards(story.arr) : setCards(arrCards);
      storySavePage.arr
        ? setSavedCards(storySavePage.arr)
        : setSavedCards(initialSavedCards);
    }
  }

  // Добавление и удаление карт ----------------------
  function addCard(card) {
    mainApi
      .addCard(card)
      .then((saveCard) => {
        setInitialSavedCards([saveCard, ...savedCards]);
        setSavedCards([saveCard, ...savedCards]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteCard(card) {
    mainApi
      .deleteCard(card)
      .then(() => {
        setInitialSavedCards((state) =>
          state.filter((c) => !(c._id === card._id))
        );
        setSavedCards((state) => state.filter((c) => !(c._id === card._id)));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // ------------------------------------------------------

  // Страница 404 ------------
  function addPageNotFound() {
    setErrorNotFound(true);
  }

  // Сообщение об ошибке в Profile
  function resetErrors() {
    setErrorMessage('');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Header loggedIn={loggedIn} />
                <Main getInitialSaveCards={getInitialSaveCards} />
                <Footer />
              </>
            }
          />
          <Route path='/' element={<ProtectedRoute />}>
            <Route
              path='/sign-in'
              element={<Login resetErrors={resetErrors} />}
            />
            <Route
              path='/sign-up'
              element={<Register resetErrors={resetErrors} />}
            />
          </Route>
          <Route
            path='/profile'
            loggedIn={loggedIn}
            element={
              <>
                <Header loggedIn={loggedIn} />
                <Profile
                  handleUpdateUser={handleUpdateUser}
                  errorMessage={errorMessage}
                  getInitialSaveCards={getInitialSaveCards}
                />
              </>
            }
          />
          <Route
            path='/movies'
            element={
              <>
                <Header loggedIn={loggedIn} />
                <Movies
                  story={story}
                  getInitialCards={getInitialCards}
                  getInitialSaveCards={getInitialSaveCards}
                  searchCards={searchCards}
                  searchShortCards={searchShortCards}
                  addCard={addCard}
                  deleteCard={deleteCard}
                  // initialSavedCards={initialSavedCards}
                  savedCards={savedCards}
                  isPreloader={isPreloader}
                  preloaderMessage={preloaderMessage}
                />
                <Footer />
              </>
            }
          />
          <Route
            path='/saved-movies'
            loggedIn={loggedIn}
            element={
              <>
                <Header loggedIn={loggedIn} />
                <SavedMovies
                  savedCards={savedCards}
                  getInitialSaveCards={getInitialSaveCards}
                  story={storySavePage}
                  deleteCard={deleteCard}
                  searchSaveCards={searchSaveCards}
                  initialSavedCards={initialSavedCards}
                  searchShortCards={searchShortCards}
                  isPreloader={isPreloader}
                  preloaderMessage={preloaderMessage}
                />
                <Footer />
              </>
            }
          />
          <Route
            path='*'
            element={
              <ErrorPage
                errorNotFound={errorNotFound}
                errorPageMessage={errorPageMessage}
                addPageNotFound={addPageNotFound}
              />
            }
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
