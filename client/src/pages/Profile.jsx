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
import { Link, useParams } from 'react-router-dom'

function Profile() {
    const params = useParams()
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [showListingError, setShowListingError] = useState(false)
    const [userListings, setUserListings] = useState([])
    console.log(userListings)
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
    const showListings = async () => {
        try {
            setShowListingError(false)
            const res = await fetch(`/api/user/listings/${currentUser._id}`)
            const data = await res.json()
            console.log(data)
            if (data.success === false) {
                setShowListingError(true)
                return
            }
            setUserListings(data)
        } catch (error) {
            setShowListingError(true)
        }
    }

    const handleDeleteListing = async (listingId) => {
        try {
            const res = await fetch(`api/listing/delete/${listingId}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return
            }
            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId),
            )
        } catch (error) {
            console.log(error.message)
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
            <p>{updateUserSuccess ? 'User is updated successfully!' : ''}</p>
            <button className="text-green-700" onClick={showListings}>
                Show Listings
            </button>
            <p className="text-red-700">
                {showListingError ? 'No listing find' : ''}
            </p>
            {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center my-7 text-2xl font-semibold">
                        Your Listings
                    </h1>
                    {userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className="flex flex-row p-3 justify-between items-center gap-4"
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="listing cover"
                                    className="h-16 w-16 object-contain"
                                />
                            </Link>
                            <Link
                                to={`/listing/${listing._id}`}
                                className="text-slate-700 font-semibold flex-1 truncate hover:underline"
                            >
                                <p>{listing.name}</p>
                            </Link>
                            <div className="flex flex-row gap-3">
                                <button
                                    onClick={() =>
                                        handleDeleteListing(listing._id)
                                    }
                                    className="text-red-700 uppercase"
                                >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className="text-green-700 uppercase">
                                        edit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Profile
