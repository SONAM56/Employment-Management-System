import React, {useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const {login} =  useAuth()
    const navigate = useNavigate();
    const {baseUrl} = useAuth();


    const handleSubmit = async (e) => {
      e.preventDefault() 
      try{
        const response = await axios.post(`${baseUrl}/api/auth/login`, {email, password});
        if(response.data.success){
          login(response.data.user)
          localStorage.setItem("token", response.data.token)
          navigate(response.data.user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
        }
      } catch(error){
        if(error.response && !error.response.data.success){
          setError(error.response.data.error)
        } else {
          setError("Server Error")
        }
        console.log(error);
      }
    }
  return (
    <div className='flex flex-col items-center h-screen justify-center
    bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6'>
      <h2 className='font-rob text-3xl text-white'>Employment Management System</h2>
      <div className='border shadow p-6 w-80 bg-white'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor="email" className='block text-gray-700'>Email</label>
            <input type="email" className='w-full px-3 py-2 border' placeholder='Enter Email' onChange={(e)=> setEmail(e.target.value)} required/>
          </div>
          <div className='mb-4'>
            <label htmlFor="password" className='block text-gray-700'>Password</label>
            <input type="password" className='w-full px-3 py-2 border' placeholder='*******'  onChange={(e)=> setPassword(e.target.value)} required/>
          </div>
          <div className='mb-4 flex items-center justify-between'>
            <label className='inline-flex items-center'>
              <input type="checkbox" className='from-checkbox' />
              <span className='ml-2 text-gray-700'>Remember me</span>
            </label>
            <Link to={"/login/forgot"} className='text-teal-600'>Forgot password?</Link>
          </div>
          {/* <div className='mb-4 flex items-center justify-between'>
            <label className='inline-flex items-center'>
              Don't have an account? <Link  to={"/signup"} className='ml-2  text-blue-500'>Signup</Link >
            </label>
           
          </div> */}
          <div className='mb-4'>
            <button type='submit'className='w-full bg-teal-600 text-white py-2'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login