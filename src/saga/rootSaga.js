import { all } from "redux-saga/effects";
import { watchLogin } from "./authSaga";

export default function* rootSaga() {
   yield all([
      watchLogin(),
   ])
}