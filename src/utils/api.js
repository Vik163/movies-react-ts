import axios from 'axios';

import { auth } from './authApi';

const baseUrl = `${window.location.protocol}${
  process.env.REACT_APP_API_URL || '//localhost:3001'
}`;

// Создаем экземпляр ===============
export const $api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

// Перехватчик ответов с обновлением accessToken ===
$api.interceptors.response.use(
  (config) => {
    // - Если ок, возвращаем config ---
    return config;
  },
  async (error) => {
    //- Если ошибка ---
    try {
      const originRequest = error.config;
      // - Проверка: статус 401, наличие config, повторной ошибки 401 ---
      if (
        error.response.status === 401 &&
        error.config &&
        !error.config._isRetry
      ) {
        // - Ставим флаг (убираем цикл повторной обработки ошибки) ---
        originRequest._isRetry = true;
        // - Обновление токена ---
        const token = localStorage.getItem('token');
        const response = await auth.checkToken(token);
        // - Новый токен ---
        originRequest.headers.authorization = response.accessToken;
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('loggedIn', 'true');

        // - Повторная отправка перехваченного запроса по config ---
        return $api.request(originRequest);
      }
    } catch (err) {
      localStorage.setItem('loggedIn', 'false');

      console.log('Не авторизован');
    }
    throw error;
  }
);
