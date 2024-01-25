export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const RESET_LOGIN_ERROR = 'RESET_LOGIN_ERROR';


export const loginRequest = (email, password, onSuccess) => ({
   type: LOGIN_REQUEST,
   payload: { email, password, onSuccess},
});

export const loginSuccess = (token, img) => ({
   type: LOGIN_SUCCESS,
   payload: { token, img },
});

export const loginFailure = (error) => ({
   type: LOGIN_FAILURE,
   payload: { error },
});
export const resetLoginError = () => ({
   type: RESET_LOGIN_ERROR,
});
