import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const mongo = process.env.MONGO;

mongoose
  .connect(mongo)
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

//create app.use with static to be able to render on render.
//client/dist is because we use VITE if we use react we will have client/build. because the file is build.
app.use(express.static(path.join(__dirname, 'client/dist')));

//the below gets with * stipulate that all files without the /api will run below app.get api
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'internal Servr error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is up and listening to port ${port}`);
});
