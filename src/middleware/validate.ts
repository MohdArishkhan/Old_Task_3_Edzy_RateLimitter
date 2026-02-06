import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Show all errors at once
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      const customError = createError('Validation failed', 400);
      (customError as any).errors = errorDetails;
      
      next(customError);
      return;
    }

    next();
  };
};