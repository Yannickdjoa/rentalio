import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Listingitem from '../components/Listingitem'

function Search() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort: 'createdAt',
        order: 'desc',
    })
    console.log(sidebardata)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const offerFromUrl = urlParams.get('offer')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const sortfromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            sortfromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                offer: offerFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                sort: sortfromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }
        const fetchListings = async () => {
            setLoading(true)
            setShowMore(false)
            const searchQuery = urlParams.toString()
            const response = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await response.json()

            if (data.length > 5) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }
            setListings(data)
            setLoading(false)
        }
        fetchListings()
    }, [location.search])

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sell'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id })
        }
        if (
            e.target.id === 'offer' ||
            e.target.id === 'parking' ||
            e.target.id === 'furnished'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true'
                        ? true
                        : false,
            })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'
            setSidebardata({ ...sidebardata, sort, order })
        }
        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const showMoreItems = async () => {
        const numberOfItems = listings.length
        const startIndex = numberOfItems
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        console.log(data)
        if (data.length < 6) {
            setShowMore(false)
        }
        setListings([...listings, ...data])
    }

    return (
        <main className="flex flex-col md:flex-row">
            <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex gap-2 items-center">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term
                        </label>
                        <input
                            onChange={handleChange}
                            value={sidebardata.searchTerm}
                            id="searchTerm"
                            type="text"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full "
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <label className="whitespace-nowrap font-semibold">
                            {' '}
                            Type:
                        </label>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}
                                type="checkbox"
                                id="all"
                                className="w-5"
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                                type="checkbox"
                                id="rent"
                                className="w-5"
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'}
                                type="checkbox"
                                id="sell"
                                className="w-5"
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.offer}
                                type="checkbox"
                                id="offer"
                                className="w-5"
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <label className="whitespace-nowrap font-semibold">
                            {' '}
                            Amenities:
                        </label>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.parking}
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <label className="font-semibold">Sort</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id="sort_order"
                            className="p-3 border rounded-lg"
                        >
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                            <option value="listingPrice_asc">
                                Price high to low
                            </option>
                            <option value="listingPrice_desc">
                                Price low to high
                            </option>
                        </select>
                    </div>

                    <button className="p-3 uppercase bg-slate-800 border rounded-lg hover:opacity-75 text-center text-white">
                        Search
                    </button>
                </form>
            </div>
            <div className="flex flex-col">
                <h1 className="font-semibold">Listing results:</h1>
                <div className="flex flex-wrap gap-4 p-7">
                    {loading && (
                        <p className="text-center font-semibold w-full text-xl">
                            Loading...
                        </p>
                    )}
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700">
                            No listing found!
                        </p>
                    )}
                    {error && (
                        <p className="text-center font-semibold">{error}</p>
                    )}
                    {!loading &&
                        !error &&
                        listings &&
                        listings.map((listing) => (
                            <Listingitem key={listing._id} listing={listing} />
                        ))}
                    {showMore && (
                        <button
                            onClick={showMoreItems}
                            className="text-green-700 hover:underline p-7 text-center w-full"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Search
