import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(401, 'listing not fund'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your listing'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(401, 'listing not fund'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'listing not fund'));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(401, 'No listing fund'));
    }
    console.log(listing);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let searchTerm = req.query.searchTerm || '';
    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sell', 'rent'] };
    }
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [true, false] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [true, false] };
    }
    let sort = req.query.sort || 'createdAt';
    let order = req.query.order || 'desc';

    const listings = await Listing.find({
      $or: [
        {
          name: {
            $regex: searchTerm,
            $options: 'i',
          },
        },

        {
          description: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ],
      type,
      offer,
      parking,
      furnished,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
