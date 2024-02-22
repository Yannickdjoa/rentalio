import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'
function Listing() {
    const { currentUser } = useSelector((state) => state.user)
    const params = useParams()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(null)
    const [copied, setCopied] = useState(false)
    const [timeOut, setTimeOut] = useState(false)
    const [contact, setContact] = useState(false)

    useEffect(() => {
        try {
            setLoading(true)
            const fetchListing = async () => {
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                console.log(params.listingId)
                console.log(data)
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(null)
            }
            fetchListing()
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }, [])

    return (
        <main>
            {loading && (
                <p className="text-center  font-semibold text-2xl my-7 ">
                    Loading...
                </p>
            )}
            {error && (
                <p className="text-center  font-semibold text-2xl my-7 ">
                    Something went wrong!
                </p>
            )}
            {listing && !error && !loading && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${url}) center no-repeat `,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="fixed-top-[13%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-slate-500"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href,
                                )
                                setCopied(true)
                                setTimeOut(() => {
                                    setCopied(false)
                                }, 2000)
                            }}
                        />
                    </div>
                    {copied && (
                        <p className="fixed-top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 ">
                            Link copied
                        </p>
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto m-y-7 gap-4">
                        <p className="font-semibold text-2xl">
                            {listing.name} - ${''}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && '/month'}
                        </p>
                        <p className="text-slate-600 text-sm flex items-center gap-3 mt-6">
                            <FaMapMarkerAlt className="text-green-700" />
                            {listing.address}
                        </p>
                        <div className="flex gap-4">
                            <p className="rounded-md bg-red-800 w-full max-w-[200px] text-white p-1 text-center">
                                {listing.type === 'sell'
                                    ? 'For Sale'
                                    : 'For Rent'}
                            </p>
                            {listing.offer && (
                                <p className="rounded-md bg-green-800 w-full max-w-[200px] text-white p-1 text-center">
                                    {listing.discountPrice
                                        ? `$${listing.discountPrice} OFF`
                                        : `$${listing.regularPrice} Net`}
                                </p>
                            )}
                        </div>
                        <p className="text-slate-800">
                            <span className="font-semibold text-black">
                                Description -{' '}
                            </span>
                            {listing.description}
                        </p>
                        <ul className="flex gap-7 font-semibold items-center text-sm text-green-900 flex-wrap sm:gap-6">
                            <li className="flex items-center gap-2 whitespace-nowrap">
                                <FaBed />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : `${listing.bedrooms} Bed`}
                            </li>
                            <li className="flex items-center gap-2 whitespace-nowrap">
                                <FaBath />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths`
                                    : `${listing.bathrooms} bath`}
                            </li>
                            <li className="flex items-center gap-2 whitespace-nowrap">
                                <FaParking />{' '}
                                {listing.parking ? 'Parking' : 'No Parking'}
                            </li>

                            <li className="flex items-center gap-2 whitespace-nowrap">
                                <FaChair />
                                {listing.furnished
                                    ? 'Furnished'
                                    : 'Not Furnished'}
                            </li>
                        </ul>

                        {currentUser &&
                            listing.userRef !== currentUser._id &&
                            !contact && (
                                <button
                                    onClick={() => setContact(true)}
                                    className="text-center uppercase p-3 rounded-lg bg-slate-700 text-white hover:opcacity-700"
                                >
                                    {' '}
                                    Contact The landload
                                </button>
                            )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Listing
