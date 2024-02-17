import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, validateRequest } from '@ijattickets/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!process.env.JWT_KEY) {
      throw new BadRequestError('JWT_KEY must be defined');
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    const response = {
      ...user.toJSON(),
      accessToken: userJwt,
    };

    res.status(StatusCodes.CREATED).send(response);
  }
);

export { router as signupRouter };
