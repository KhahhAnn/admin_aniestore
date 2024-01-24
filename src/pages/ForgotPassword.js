import React from 'react'
import CustomInput from '../components/CustomInput'

const ForgotPassword = () => {
   return (
      <div className='py-5 login' style={{minHeight: "100vh" }}>
         <br />
         <br />
         <br />
         <br />
         <br />
         <div className='my-5 w-25 bg-white rounded-3 mx-auto p-3'>
            <h3 className='text-center'>Quên mật khẩu</h3>
            <p className='text-center'>vui lòng nhập email của bạn để lấy lại mặt khẩu.</p>
            <form action=''>
               <CustomInput type="text" placeholder="Email Address" id="email" />
               <button
                  className='border-0 px-3 py-2 text-white fw-bold w-100'
                  style={{ background: "#ffd333" }}
                  type='submit'
               >Lấy lại mật khẩu</button>
            </form>
         </div>
      </div>
   )
}

export default ForgotPassword