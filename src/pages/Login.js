// Login.js
import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginRequest, resetLoginError } from '../action/authActions';

function Login() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const loginError = useSelector((state) => state.auth.error);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleLogin = async () => {
      dispatch(resetLoginError());
      dispatch(loginRequest(email, password, () => navigate("/admin")));
   };

   useEffect(() => {
      const errorTimeout = setTimeout(() => {
         dispatch(resetLoginError());
      }, 5000);

      return () => {
         clearTimeout(errorTimeout);
      };
   }, [loginError, dispatch]);

   return (
      <MDBContainer fluid className='login-form'>
         <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol col='12'>
               <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                  <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                     <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                     <p className="text-white-50 mb-5">Please enter your login and password!</p>
                     <MDBInput
                        wrapperClass='mb-4 mx-5 w-100 '
                        labelClass='text-white'
                        label='Email address'
                        id='formControlLg'
                        type='email'
                        size="lg"
                        className='text-login'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                     <MDBInput
                        wrapperClass='mb-4 mx-5 w-100 '
                        labelClass='text-white'
                        label='Password'
                        id='formControlLg'
                        type='password'
                        size="lg"
                        className='text-login'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>                     
                     {loginError && <div className="text-danger mb-3">{loginError}</div>}
                     <MDBBtn outline className='mx-2 px-5' color='white' size='lg' onClick={handleLogin}>
                        Login
                     </MDBBtn>
                  </MDBCardBody>
               </MDBCard>
            </MDBCol>
         </MDBRow>
      </MDBContainer>
   );
}

export default Login;
