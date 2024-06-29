// authSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginFailure, loginSuccess } from '../action/authActions';
import axios from 'axios';

function isValidPassword(password) {
   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,})$/;
   return passwordRegex.test(password);
}

function* loginUserWorker(action) {
   try {
      debugger
      const { email, password } = action.payload;
      if (!isValidPassword(password)) {
         yield put(loginFailure("Định dạng mật khẩu không hợp lệ. Mật khẩu phải chứa ít nhất một chữ in hoa, một ký tự đặc biệt và dài ít nhất 8 ký tự."));
         return;
      }
      const response = yield call(axios.post, 'http://localhost:8080/auth/login', { email, password });
      if (response.data) {
         if (!response.data.permission.includes('ROLE_ADMIN')) {
            yield put(loginFailure("Tài khoản không có quyền truy cập."));
            return;
         }
         const token = response.data.jwt;  
         console.log(response.data);
         localStorage.setItem("token", token);
         yield put(loginSuccess(token));
      }
      if (action.payload.onSuccess) {
         action.payload.onSuccess();
      }
   } catch (error) {
      yield put(loginFailure("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại."));
   }
}

export function* watchLogin() {
   yield takeLatest(LOGIN_REQUEST, loginUserWorker);
}
