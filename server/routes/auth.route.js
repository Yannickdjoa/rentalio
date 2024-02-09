import express from 'express';

import signup from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/auth', signup);

export default authRouter;
