import React from 'react'
import CustomInput from '../components/CustomInput'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
   return (
      <div className='py-5' style={{background: "#ffd333", minHeight: "100vh"}}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className='my-5 w-25 bg-white rounded-3 mx-auto p-3'>
         <h3 className='text-center'>Đổi mật khẩu</h3>
         <p className='text-center'>Vi lòng nhập mật khẩu mới để đổi mật khẩu.</p>
         <form action=''>
         <CustomInput type="password" placeholder="New Password" id="pass" />
         <CustomInput type="password" placeholder="Comfirm Password" id="pass" />
         <Link 
            className='border-0 px-3 py-2 text-white fw-bold w-100' 
            style={{background: "#ffd333"}}
            type='submit'
         >Đổi mật khẩu</Link>
         </form>
      </div>
   </div>
   )
}

export default ResetPassword