import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'

function Header() {
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])
    const handleSearch = async (e) => {
        e.preventDefault()
       const urlParams = new URLSearchParams(window.location.search)
       urlParams.set('searchTerm', searchTerm)
       const searchQuery = urlParams.toString()
       navigate(`/search?${searchQuery}`)

    }

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to={'/'}>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">R </span>
                        <span className="text-slate-700">Rentalio</span>
                    </h1>
                </Link>
                <form
                    onClick={handleSearch}
                    className="bg-slate-100 p-3 rounded-lg flex items-center"
                >
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        type="text"
                        placeholder="search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                    />
                    <button>
                        <FaSearch className="text-slate-600" />
                    </button>
                </form>

                <ul className="flex p-1 gap-4">
                    <Link to={'/'}>
                        <li className="text-slate-700 hover:underline hidden sm:inline">
                            Home
                        </li>
                    </Link>
                    <Link to={'/about'}>
                        <li className="text-slate-700 hover:underline hidden sm:inline">
                            About
                        </li>
                    </Link>
                    <Link to={'/profile'}>
                        {currentUser ? (
                            <img
                                className="rounded-full h-7 w-7 object-cover "
                                src={currentUser.avatar}
                                alt="profile"
                            />
                        ) : (
                            <li className="text-slate-700 hover:underline">
                                SignIn
                            </li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header
