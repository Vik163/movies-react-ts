import axios from 'axios';

class MoviesApi {
  constructor(settings) {
    this._settings = settings;
  }

  getCards() {
    return axios
      .get(`https://api.nomoreparties.co/beatfilm-movies`)
      .then((res) => res.data);
  }
}

export const moviesApi = new MoviesApi();
