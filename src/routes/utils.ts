import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
export const saltRounds = 10;
const jwtToken = "shhhhhhh";


export const checkErrors = (req: Request,res: Response,next: NextFunction
) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors:', errors);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

