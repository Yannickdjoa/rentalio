import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'

function Profile() {
    const { currentUser } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})

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
    return (
        <div className="p-3 max-w-lg mx-auto">
            <form className=" flex flex-col gap-4">
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
                    placeholder="username"
                    className="rounded-lg border p-3 "
                />
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    className="rounded-lg border p-3 "
                />
                <input
                    id="password"
                    type="text"
                    placeholder="password"
                    className="rounded-lg border p-3 "
                />
                <button className="text-white uppercase bg-slate-700 rounded-lg p-3 hover:opacity-95 disabled: opacity-80">
                    Update
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    className="text-red-700
              cursor-pointer"
                >
                    delete account
                </span>
                <span
                    className="text-red-700
              cursor-pointer"
                >
                    sign out
                </span>
            </div>
        </div>
    )
}

export default Profile
