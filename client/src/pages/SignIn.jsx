import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice.js'

function SignIn() {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }
    console.log(formData)
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(signInStart())
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json()
            console.log(data)
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            dispatch(signInFailure(error.message))
        }
    }
    return (
        <div className="p-3 max-w-lg  mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="email"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    id="email"
                />
                <input
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    id="password"
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-green-400 disabled: opacity-80"
                >
                    {loading ? 'is loading...' : 'Sign In'}
                </button>
            </form>

            <div className="flex gap-3 mt-5 ">
                <p>You do not have an account ? </p>
                <Link to={'/sign-up'}>
                    <span className="text-red-500 hover:opacity-75">
                        Sign-up
                    </span>
                </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    )
}

export default SignIn
