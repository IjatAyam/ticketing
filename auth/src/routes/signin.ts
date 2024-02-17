import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError, validateRequest } from '@ijattickets/common';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!process.env.JWT_KEY) {
      throw new BadRequestError('JWT_KEY must be defined');
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch || !process.env.JWT_KEY) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    const response = {
      ...existingUser.toJSON(),
      accessToken: userJwt,
    };

    res.status(StatusCodes.OK).send(response);
  }
);

export { router as signinRouter };
