import logoImage from '../../images/jobfitlogo.png'
import React,{ useState } from 'react'
import {useNavigate,Link} from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {

  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e)=>{
    e.preventDefault();
    await handleLogin({email, password})
    navigate('/')
  }

  if(loading){
    return(<main><h1>Loading...</h1></main>)
  }


  return (
/* creating login form */
    <main className="flex justify-center items-center min-h-screen w-full bg-gray-100">

          <div className="w-full max-w-lg h-auto bg-white p-10 rounded-2xl m-2 shadow-lg">
          
            <div className="logo overflow-hidden bg-transparent">
              <img src={logoImage} className='w-full h-30 object-cover'/>
            </div>

            <div className='form-div pt-5'>

              <form 
              onSubmit={(e)=>{
                submitHandler(e)
              }}
              className='flex flex-col'>
                <input 
                onChange={(e)=>{
                  setEmail(e.target.value)
                }}
                className='py-3 px-3 border-2 border-gray-200 rounded-lg outline-none placeholder:text-gray-400' 
                type="email" 
                placeholder='Email' 
                name='email' required
                />
                
                <input 
                onChange={(e)=>{
                  setPassword(e.target.value)
                }}
                className='py-3 px-3 border-2  border-gray-200 rounded-lg mt-4 outline-none placeholder:text-gray-400' type="password" 
                placeholder='Password' 
                name='password'
                required

                />

                <button 
                className='py-3 px-3 rounded-lg w-full bg-[#0BA4AC] font-semibold text-white mt-10 tracking-tight hover:bg-[#007B94] active:scale-95 cursor-pointer'>
                  Log In
                </button>
              </form>

            </div>

            <p className='mt-5 tracking-tight'>Register your account ? <Link className='text-[#007B94] font-semibold tracking-tight' to={'/register'}>Register</Link></p>
        </div>
    </main>

  )
}

export default Login