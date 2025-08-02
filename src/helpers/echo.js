// src/services/echo.js
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import { api, baseHost, baseURL } from '../config';

window.io = io;

const echo = new Echo({
  broadcaster: 'socket.io',
  host: `${baseHost}:6001`,
  // client: io,
  authHost: baseURL,      // -> http://127.0.0.1:8001/api
  authEndpoint: '/broadcasting/auth',// -> /broadcasting/auth
  auth: {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('authUser'))?.token}`,
      Accept: 'application/json',
    }
  },
  transports: ['websocket','polling','flashsocket'],
  reconnectionAttempts: 1,
  reconnection: true,
  autoConnect: true,
})

echo.connector.socket.on('connect', () => {
  const socketId = echo.connector.socket.id;
  // Gán vào header auth để server biết
  echo.connector.options.auth.headers['X-Socket-Id'] = socketId;
  console.log('WebSocket connected!, socket id:', echo.connector.socket.id);
});
echo.connector.socket.on('disconnect', () => {
  console.log('WebSocket disconnected!');
});
echo.connector.socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

export default echo;
