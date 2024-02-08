import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import dotenv from 'dotenv';
dotenv.config();

const mongo = process.env.MONGO;
const app = express();
mongoose
  .connect(mongo)
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/api/v1/user', userRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is up and listening to port ${port}`);
});
