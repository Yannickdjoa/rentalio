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

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is up and listening to port ${port}`);
});
