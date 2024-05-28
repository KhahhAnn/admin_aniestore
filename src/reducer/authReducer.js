import { LOGIN_FAILURE, LOGIN_SUCCESS, RESET_LOGIN_ERROR } from '../action/authActions';

const initialState = {
   token: null,
   error: null,
};

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case LOGIN_SUCCESS:
         return { ...state, token: action.payload.token, error: null };

      case LOGIN_FAILURE:
         return { ...state, token: null, error: action.payload.error };

      case RESET_LOGIN_ERROR:
         return { ...state, error: null };
      default:
         return state;
   }
};

export default authReducer;
