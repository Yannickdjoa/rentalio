import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
dotenv.config();

const mongo = process.env.MONGO;
const app = express();
app.use(express.json());
mongoose
  .connect(mongo)
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
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
