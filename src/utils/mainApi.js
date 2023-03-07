import { $api } from './api';

class MainApi {
  constructor(settings) {
    this._settings = settings;
  }

  getUserInfo() {
    return $api
      .get('/users/me', {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((res) => res.data);
  }

  getSaveCards() {
    return $api
      .get('/movies', {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((res) => res.data);
  }

  addCard(card) {
    return $api
      .post(
        '/movies',
        {
          country: card.country,
          director: card.director,
          duration: card.duration,
          year: card.year,
          description: card.description,
          image: `https://api.nomoreparties.co/${card.image.url}`,
          trailerLink: card.trailerLink,
          nameRU: card.nameRU,
          nameEN: card.nameEN,
          thumbnail: `https://api.nomoreparties.co/${card.image.formats.thumbnail.url}`,
          movieId: card.id,
        },
        {
          headers: { authorization: localStorage.getItem('token') },
        }
      )
      .then((res) => res.data);
  }

  deleteCard(obj) {
    return $api
      .delete(`/movies/${obj._id}`, {
        headers: { authorization: localStorage.getItem('token') },
      })
      .then((res) => res.data);
  }

  sendInfoProfile(formValues) {
    return $api
      .patch(
        '/users/me',
        {
          name: formValues.name,
          email: formValues.email,
        },
        {
          headers: { authorization: localStorage.getItem('token') },
        }
      )
      .then((res) => res.data);
  }
}

export const mainApi = new MainApi();
