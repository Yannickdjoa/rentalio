import React from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
    return (
        <div className="p-3 max-w-lg  mx-auto">
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form className="flex flex-col gap-4">
                <input type="text" placeholder="username" className='border p-3 rounded-lg' id='username'/>
                <input type="email" placeholder="email" className='border p-3 rounded-lg' id='email'/>
                <input type="password" placeholder="password" className='border p-3 rounded-lg' id='password'/>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-green-400 disabled: opacity-80">Sign Up</button>
            </form>
            
            <div className='flex gap-3 mt-5 '>
                <p>You have an account ? </p>
                <Link to={'/sign-in'} >
                  <span className='text-red-500 hover:opacity-75'>Sign-in</span>
                </Link>
            </div>
        </div>
    )
}

export default SignUp
