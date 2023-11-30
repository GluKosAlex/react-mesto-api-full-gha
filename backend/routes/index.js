import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Router } from 'express';
import { errors } from 'celebrate';

import usersRouter from './users.js';
import cardsRouter from './cards.js';
import { createUser, login } from '../controllers/users.js';
import auth from '../middlewares/auth.js';
import CustomError from '../utils/customError.js';
import globalErrorHandler from '../controllers/errors.js';
import userAuthValidate from '../middlewares/userAuthValidate.js';
import cors from '../middlewares/cors.js';
import { requestLogger, errorLogger } from '../middlewares/logger.js';

const router = new Router();

router.use(requestLogger);

router.use(cors);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.post('/signin', userAuthValidate, login);
router.post('/signup', userAuthValidate, createUser);
router.use('*', auth, (req, res, next) => {
  const err = new CustomError(
    `Error: ${StatusCodes.NOT_FOUND} ${req.originalUrl} ${ReasonPhrases.NOT_FOUND}`,
    StatusCodes.NOT_FOUND,
  );
  next(err);
});

router.use(errorLogger);

router.use(errors());
router.use(globalErrorHandler);

export default router;
