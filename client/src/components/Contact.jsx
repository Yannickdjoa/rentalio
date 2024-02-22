import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Contact({ listing }) {
    const [landload, setLandload] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandload = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandload(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandload()
    }, [listing.userRef])
    const handleChange = async (e) => {
        setMessage(e.target.value)
    }

    return (
        <div>
            {landload && (
                <div className="flex flex-col gap-2 mt-4 mb-7">
                    <p>
                        Contact {''}
                        <span className="font-semibold">
                            {landload.username}
                        </span>
                        {''} for {''}
                        <span className="font-semibold">
                            {listing.name.toLowerCase()}
                        </span>
                    </p>
                    <textarea
                        onChange={handleChange}
                        name="message"
                        id="message"
                        value={message}
                        placeholder="Enter your message here..."
                        className="border w-full p-3 rounded-lg"
                    ></textarea>
                    <Link
                        to={`mailto: ${landload.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className="bg-slate-700 text-center text-white p-3 rounded-lg uppercase hover:bg-green-400 disabled: opacity-80"
                    >
                        Send message
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Contact
