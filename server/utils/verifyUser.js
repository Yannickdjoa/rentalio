import { errorHandler } from './error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtToken = process.env.JWT_SECRET;
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, 'You are not authorized'));

  jwt.verify(token, jwtToken, (error, user) => {
    if (error) {
      return next(errorHandler(403, 'Forbidden'));
    }
    req.user = user;
    next();
  });
};
