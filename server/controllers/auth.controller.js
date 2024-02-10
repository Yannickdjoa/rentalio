import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('user created successfully');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const jwtToken = process.env.JWT_SECRET;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'wrong credentials!'));
    const validPassword = await bcryptjs.compareSync(
      password,
      validUser.password
    );
    if (!validPassword) return next(errorHandler(404, 'wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, jwtToken);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
