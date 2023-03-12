import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/redux';

import './MoviesCardList.css';

import Card from '../MoviesCard/MoviesCard.js';

function MoviesCardList(props) {
  const { deleteCard, addCard, pageSaveMovies } = props;

  const { movies, savedCards } = useAppSelector((state) => ({
    movies: state.moviesReducer.movies,
    savedCards: state.moviesReducer.moviesSaved,
  }));
  // const [movies, setMovies] = useState([]);
  console.log(movies);
  // console.log(cards);
  // console.log(savedCards);
  // const initialCards = JSON.parse(localStorage.getItem('initialCards'));
  // Кнопка ещё ---------------------------------------
  // Точки перелома -------------------------
  const [isDesktop, setIsDesktop] = useState(
    window.matchMedia('(min-width: 928px)').matches
  );
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 600px)').matches
  );
  // Количество отображаемых карт в зависимости от ширины экрана ---
  const numberAddCards = (isDesktop && 12) || (isMobile && 5) || 8;
  const [indexArray, setIndexArray] = useState(numberAddCards);

  // useEffect(() => {
  //   pageSaveMovies ? setMovies(savedCards) : setMovies(cards);
  // }, []);

  useEffect(() => {
    setIndexArray(numberAddCards);
  }, [isDesktop, isMobile]);
  // ---------------------------------------------------------------
  // Точки перелома ----------------------------------------------------------
  useEffect(() => {
    const handler = (e) => setIsDesktop(e.matches);
    window.matchMedia('(min-width: 928px)').addEventListener('change', handler);
    return () =>
      window
        .matchMedia('(min-width: 928px)')
        .removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => setIsMobile(e.matches);
    window.matchMedia('(max-width: 600px)').addEventListener('change', handler);
    return () =>
      window
        .matchMedia('(max-width: 600px)')
        .removeEventListener('change', handler);
  }, [isDesktop]);
  // ---------------------------------------------------------------------------

  // Добавление карт в зависимости от ширины экрана ---------------------------
  const addMovies = () => {
    isDesktop ? setIndexArray(indexArray + 3) : setIndexArray(indexArray + 2);
  };

  const moviesCardList = (
    <ul className='moviesCardList__container'>
      {movies &&
        movies
          .map((card) => (
            <Card
              card={card}
              key={card.id || card._id}
              isMobile={isMobile}
              addCard={addCard}
              // initialSavedCards={initialSavedCards}
              deleteCard={deleteCard}
              // savedCards={savedCards}
              pageSaveMovies={pageSaveMovies}
            />
          ))
          .slice(0, !pageSaveMovies ? indexArray : 1000)}
    </ul>
  );
  // -------------------------------------------------------------------------

  return (
    <section className='moviesCardList'>
      <>
        {moviesCardList}
        {/* Кнопка еще только на странице несохраненных фильмов */}
        {!pageSaveMovies &&
          moviesCardList.props.children.length < movies.length && (
            <button
              className='moviesCardList__button-else button-hover'
              aria-label='in'
              type='button'
              onClick={addMovies}
            >
              Ещё
            </button>
          )}
      </>
    </section>
  );
}

export default MoviesCardList;
