import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div>
            <form className=" flex flex-col gap-4">
                <img
                    className="rounded-full h-24 w-24 self-center mt-2 object-cover "
                    src={currentUser.avatar}
                    alt="Profile"
                />
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
