// import {
//     getDownloadURL,
//     getStorage,
//     ref,
//     uploadBytesResumable,
// } from 'firebase/storage'
// import React, { useState } from 'react'
// import { app } from '../firebase'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'

// function Listing() {
//     const navigate = useNavigate()
//     const { currentUser } = useSelector((state) => state.user)
//     const [files, setFiles] = useState([])
//     const [formData, setFormData] = useState({
//         imageUrls: [],
//         name: '',
//         description: '',
//         address: '',
//         type: 'rent',
//         parking: false,
//         furnished: false,
//         offer: false,
//         bedrooms: 1,
//         bathrooms: 1,
//         listingPrice: 50,
//         discountPrice: 0,
//     })
//     const [imageUploadError, setImageUploadError] = useState(false)
//     const [uploading, setUploading] = useState(null)
//     const [error, setError] = useState(false)
//     const [loading, setLoading] = useState(false)

//     console.log(formData)
//     const handleUpload = (e) => {
//         if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
//             setUploading(true)
//             setImageUploadError(false)
//             const promises = []
//             for (let i = 0; i < files.length; i++) {
//                 promises.push(storeImage(files[i]))
//             }
//             Promise.all(promises)
//                 .then((urls) => {
//                     setFormData({
//                         ...formData,
//                         imageUrls: formData.imageUrls.concat(urls),
//                     })
//                     setImageUploadError(false)
//                     setUploading(false)
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     setImageUploadError(
//                         'Image upload failed (max 2 mb per image)',
//                     )
//                 })
//         } else {
//             setImageUploadError('You can only upload 6 images per listing')
//             setUploading(false)
//         }
//     }
//     const storeImage = async (file) => {
//         return new Promise((resolve, reject) => {
//             const storage = getStorage(app)
//             const fileName = new Date().getTime() + file.name
//             const storageRef = ref(storage, fileName)
//             const uploadTask = uploadBytesResumable(storageRef, file)
//             uploadTask.on(
//                 'state_changed',
//                 (snapshot) => {
//                     const progress =
//                         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                     console.log(`upload is ${progress}% done`)
//                 },
//                 (error) => {
//                     reject(error)
//                 },
//                 () => {
//                     getDownloadURL(uploadTask.snapshot.ref).then(
//                         (downloadURL) => {
//                             resolve(downloadURL)
//                         },
//                     )
//                 },
//             )
//         })
//     }
//     const handleDeleteImage = (index) => {
//         setFormData({
//             ...formData,
//             imageUrls: formData.imageUrls.filter((_, i) => i !== index),
//         })
//     }
//     const handleChange = (e) => {
//         if (e.target.id === 'sell' || e.target.id === 'rent') {
//             setFormData({ ...formData, type: e.target.id })
//         }

//         if (
//             e.target.id === 'parking' ||
//             e.target.id === 'furnished' ||
//             e.target.id === 'offer'
//         ) {
//             setFormData({ ...formData, [e.target.id]: e.target.checked })
//         }
//         if (
//             e.target.type === 'number' ||
//             e.target.type === 'text' ||
//             e.target.type === 'textarea'
//         ) {
//             setFormData({ ...formData, [e.target.id]: e.target.value })
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             if (formData.imageUrls.length < 1) {
//                 return setError('You must upload at least 1 image')
//             }
//             if (formData.regularPrice < formData.discountPrice) {
//                 return setError('discounted price must be lower')
//             }
//             setLoading(true)
//             const response = await fetch(
//                 'api/listing/update',
//                 {
//                     method: 'PUT',
//                     headers: {
//                         'content-type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         ...formData,
//                         userRef: currentUser._id,
//                     }),
//                 },
//                 { new: true },
//             )
//             const data = await response.json()
//             setLoading(false)
//             if (data.success === false) {
//                 setError(data.message)
//             }
//             navigate(`/listing/${data._id}`)
//         } catch (error) {
//             setError(error.message)
//             setLoading(false)
//         }
//     }

//     return (
//         <main className="p-3 max-w-4xl mx-auto">
//             <h1 className="text-3xl my-7 font-semibold text-center">
//                 Update a Listing
//             </h1>
//             <form
//                 onSubmit={handleSubmit}
//                 className="flex flex-col sm:flex-row gap-4"
//             >
//                 <div className="flex flex-col gap-4 flex-1">
//                     <input
//                         id="name"
//                         type="text"
//                         placeholder="Name"
//                         className="border p-3 rounded-lg"
//                         maxLength="60"
//                         minLength="10"
//                         required
//                         onChange={handleChange}
//                         value={formData.name}
//                     />
//                     <textarea
//                         id="description"
//                         type="textarea"
//                         placeholder="description"
//                         className="border p-3 rounded-lg"
//                         required
//                         onChange={handleChange}
//                         value={formData.description}
//                     />
//                     <input
//                         id="address"
//                         type="text"
//                         placeholder="address"
//                         className="border p-3 rounded-lg"
//                         required
//                         onChange={handleChange}
//                         value={formData.address}
//                     />

//                     <div className="flex gap-6 flex-wrap">
//                         <div className="flex gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="sell"
//                                 className="w-5"
//                                 onChange={handleChange}
//                                 checked={formData.type === 'sell'}
//                             />
//                             <span>Sell</span>
//                         </div>
//                         <div className="flex gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="rent"
//                                 className="w-5"
//                                 onChange={handleChange}
//                                 checked={formData.type === 'rent'}
//                             />
//                             <span>Rent</span>
//                         </div>
//                         <div className="flex gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="parking"
//                                 className="w-5"
//                                 onChange={handleChange}
//                                 checked={formData.parking}
//                             />
//                             <span>Parking spot</span>
//                         </div>
//                         <div className="flex gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="furnished"
//                                 className="w-5"
//                                 onChange={handleChange}
//                                 checked={formData.furnished}
//                             />
//                             <span>Furnished</span>
//                         </div>
//                         <div className="flex gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="offer"
//                                 className="w-5"
//                                 onChange={handleChange}
//                                 checked={formData.offer}
//                             />
//                             <span>Offer</span>
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-4">
//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="number"
//                                 id="bedrooms"
//                                 min="1"
//                                 max="10"
//                                 required
//                                 className="border border-gray-300 rounded-lg p-1"
//                                 onChange={handleChange}
//                                 checked={formData.bedrooms}
//                             />
//                             <span>Beds</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="number"
//                                 id="bathrooms"
//                                 min="1"
//                                 max="10"
//                                 required
//                                 className="border border-gray-300 rounded-lg p-1"
//                                 onChange={handleChange}
//                                 checked={formData.bathrooms}
//                             />
//                             <span>Baths</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="number"
//                                 id="listingPrice"
//                                 min="50"
//                                 max="1000000"
//                                 required
//                                 className="border border-gray-300 rounded-lg p-1"
//                                 onChange={handleChange}
//                                 checked={formData.listingPrice}
//                             />
//                             <div className="flex flex-col text-center">
//                                 <span>Reg. price</span>
//                                 <span className="text-xs">($/Month)</span>
//                             </div>
//                         </div>
//                         {formData.offer && (
//                             <div className="flex items-center gap-2">
//                                 <input
//                                     type="number"
//                                     id="discountPrice"
//                                     min="0"
//                                     max="1000000"
//                                     required
//                                     className="border border-gray-300 rounded-lg p-1"
//                                     onChange={handleChange}
//                                     checked={formData.discountPrice}
//                                 />
//                                 <div className="flex flex-col items-center">
//                                     <span>Discounted price</span>
//                                     <span className="text-xs">($/Month)</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 <div className="flex flex-col flex-1 gap-4">
//                     <p className="font-semibold">
//                         Images:
//                         <span className="font-normal text-gray-600 ml-2">
//                             The first image will be the cover (max 6)
//                         </span>
//                     </p>
//                     <div>
//                         <input
//                             onChange={(e) => {
//                                 setFiles(e.target.files)
//                             }}
//                             type="file"
//                             id="images"
//                             accept="image/*"
//                             multiple
//                             className="p-3 border border-gray-300 rounded w-full"
//                         />
//                         <button
//                             disabled={uploading}
//                             onClick={handleUpload}
//                             type="button"
//                             className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
//                         >
//                             {uploading ? 'uploading...' : 'Upload'}
//                         </button>
//                     </div>
//                     <p className="text-red-700">
//                         {imageUploadError && imageUploadError}
//                     </p>
//                     {formData.imageUrls.length > 0 &&
//                         formData.imageUrls.map((url, index) => (
//                             <div
//                                 key={url}
//                                 className="flex justify-betweenp-3 border items-center"
//                             >
//                                 <img
//                                     src={url}
//                                     alt="listing image"
//                                     className="w-20 h-20 object-contain rounded-lg"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => handleDeleteImage(index)}
//                                     className="p-3 text-red-700 hover:opacity-70"
//                                 >
//                                     delete
//                                 </button>
//                             </div>
//                         ))}
//                     <div>
//                         <button
//                             disabled={loading || uploading}
//                             type="submit"
//                             className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//                         >
//                             {loading ? 'updating listing...' : 'update listing'}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </main>
//     )
// }

// export default Listing
