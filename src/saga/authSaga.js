// authSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginFailure, loginSuccess } from '../action/authActions';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function isValidPassword(password) {
   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,})$/;
   return passwordRegex.test(password);
}

function* loginUserWorker(action) {
   try {
      const { email, password } = action.payload;
      if (!isValidPassword(password)) {
         yield put(loginFailure("Invalid password format. Password must contain at least one uppercase letter, one special character, and be at least 8 characters long."));
         return;
      }
      const response = yield call(axios.post, 'http://localhost:8080/api/sign-in', { email, password });
      if (response.data) {
         const token = response.data.token;  
         const img = response.data.img;
         console.log(response.data);
         localStorage.setItem("token", token);
         localStorage.setItem("img", img);
         const userData = jwtDecode(token);
         if (userData) {
            const isAdmin = userData.isAdmin;
            if (!isAdmin) {
               yield put(loginFailure("The account does not have access rights"));
               return;
            }
            yield put(loginSuccess(token, img));
         }
      }
      if (action.payload.onSuccess) {
         action.payload.onSuccess();
      }
   } catch (error) {
      yield put(loginFailure("Invalid username or password. Please try again."));
   }
}

export function* watchLogin() {
   yield takeLatest(LOGIN_REQUEST, loginUserWorker);
}
