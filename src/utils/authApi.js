import { $api } from './api';

export class Auth {
  registration(name, password, email) {
    return $api
      .post('/signup', {
        name: name,
        password: password,
        email: email,
      })
      .then((res) => res.data);
  }

  authorization(password, email) {
    return $api
      .post('/signin', {
        password: password,
        email: email,
      })
      .then((res) => res.data);
  }

  logout() {
    return $api.get('/logout').then((res) => res);
  }

  checkToken(token) {
    return $api
      .get('/token', {
        headers: { authorization: token },
      })
      .then((res) => res.data);
  }
}

export const auth = new Auth();
