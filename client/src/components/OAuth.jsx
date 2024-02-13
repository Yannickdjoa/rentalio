import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'
function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleAuth = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            })
            console.log(result)
            const data = await res.json()
            console.log(data)
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('error detected', error)
        }
    }

    return (
        <button
            type="button"
            className="text-white rounded-lg bg-red-700 p-3 hover:opacity-80 uppercase"
            onClick={handleGoogleAuth}
        >
            Continue with Google
        </button>
    )
}

export default OAuth
