import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import Listingitem from '../components/Listingitem'

function Home() {
    const [offerListing, setOfferListing] = useState([])
    const [rentListing, setRentListing] = useState([])
    const [saleListing, setSaleListing] = useState([])
    SwiperCore.use([Navigation])
    console.log(saleListing)
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4')
                const data = await res.json()

                setOfferListing(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchOfferListings()
        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sell&limit=4')
                const data = await res.json()

                setSaleListing(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchSaleListings()
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4')
                const data = await res.json()

                setRentListing(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchRentListings()
    }, [])
    return (
        <div>
            <div className="flex flex-col gap-7 p-28 px-3 max-w-6xl  mx-auto">
                <h1 className="text-3xl lg:text-6xl font-bold text-slate-700">
                    Find your next{' '}
                    <span className="text-slate-500">perfect</span> <br />
                    place with ease
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                    Rentalio will help you find your home fast, easy and
                    comfortable. <br />
                    Our expert support are always available.
                </p>
                <Link
                    to={'/search'}
                    className="text-blue-800 font-bold hover:underline"
                >
                    lets start now...
                </Link>
            </div>
            <div>
                <Swiper navigation>
                    {offerListing &&
                        offerListing.length > 0 &&
                        offerListing.map((listing) => (
                            <SwiperSlide key={listing._id}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${listing.imageUrls[0]}) center no-repeat `,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            <div>
                {offerListing && offerListing.length > 0 && (
                    <div className="max-w-6xl mx-auto flex flex-col   p-3  gap-8 mt-10">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-700">
                                Recent offers
                            </h1>
                            <Link
                                className="text-blue-800 text-sm font-bold hover:underline"
                                to={'/search?offer=true'}
                            >
                                Show more offers
                            </Link>
                        </div>
                        <div className="flex flex-wrap flex-row gap-4">
                            {offerListing.map((listing) => (
                                <Listingitem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {rentListing && rentListing.length > 0 && (
                    <div className="max-w-6xl mx-auto flex flex-col   p-3  gap-8 mt-10">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-700">
                                Recent places for rent
                            </h1>
                            <Link
                                className="text-blue-800 text-sm font-bold hover:underline"
                                to={'/search?offer=true'}
                            >
                                Show more places for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap flex-row gap-4">
                            {rentListing.map((listing) => (
                                <Listingitem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {saleListing && saleListing.length > 0 && (
                    <div className="max-w-6xl mx-auto flex flex-col   p-3  gap-8 mt-10">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-700">
                                Recent places for sale
                            </h1>
                            <Link
                                className="text-blue-800 text-sm font-bold hover:underline"
                                to={'/search?offer=true'}
                            >
                                Show more places for sale
                            </Link>
                        </div>
                        <div className="flex flex-wrap flex-row gap-4">
                            {saleListing.map((listing) => (
                                <Listingitem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
