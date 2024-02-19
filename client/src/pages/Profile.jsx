import React, { useEffect, useRef, useState } from 'react'
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    signOutStart,
    signOutFailure,
    signOutSuccess,
} from '../redux/user/userSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import { Link } from 'react-router-dom'

function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])
    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        //use Date().getTime() to stamp the file so its unique
        const fileName = new Date().getTime() + file.name
        // if the file is in a folder, interpolate that folder & fileName
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        console.log(uploadTask)
        //to have the purcentage of downloaded file
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFilePerc(Math.round(progress))
            },
            (error) => {
                setFileUploadError(true)
            },
            //function to update the downloaded pic from firebase
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL }),
                )
            },
        )
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
            }
            dispatch(updateUserSuccess(data))
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }
    const handleDeleteUser = async () => {
        dispatch(deleteUserStart())
        try {
            const res = await fetch(`api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(error.message))
            }
            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async () => {
        dispatch(signOutStart())
        try {
            const res = await fetch('/api/auth/signout')
            const data = await res.json()
            if (data.success === false) {
                dispatch(signOutFailure(error.message))
            }
            dispatch(signOutSuccess(data))
        } catch (error) {
            dispatch(signOutFailure(error.message))
        }
    }
    return (
        <div className="p-3 max-w-lg mx-auto">
            <form onClick={handleSubmit} className=" flex flex-col gap-4">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    onClick={() => fileRef.current.click()}
                    className="rounded-full h-24 w-24 self-center mt-2 object-cover "
                    src={formData.avatar || currentUser.avatar}
                    alt="Profile"
                />
                <p className="self-center">
                    {fileUploadError ? (
                        <span className="text-red-700 ">
                            image not upload (image must be less than 2mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-yellow-500 ">{`Uploading ${filePerc}`}</span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-700 ">
                            Image successfuly uploaded
                        </span>
                    ) : (
                        ''
                    )}
                </p>

                <input
                    id="username"
                    type="text"
                    defaultValue={currentUser.username}
                    placeholder="username"
                    className="rounded-lg border p-3 "
                    onChange={handleChange}
                />
                <input
                    id="email"
                    type="text"
                    defaultValue={currentUser.email}
                    placeholder="email"
                    className="rounded-lg border p-3 "
                    onChange={handleChange}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    className="rounded-lg border p-3 "
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="text-white uppercase bg-slate-700 rounded-lg p-3 hover:opacity-95 disabled: opacity-80"
                >
                    {loading ? 'loading...' : 'Update'}
                </button>
                <Link
                    to={'/create-listing'}
                    className="bg-green-700 p-3 rounded-lg text-white uppercase hover:opacity-90 text-center"
                >
                    Create Listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700
              cursor-pointer"
                >
                    delete account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700
              cursor-pointer"
                >
                    sign out
                </span>
            </div>
            <p className="text-red-700">{error ? error : ''}</p>
        </div>
    )
}

export default Profile
