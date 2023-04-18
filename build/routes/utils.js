"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrors = exports.saltRounds = void 0;
const express_validator_1 = require("express-validator");
exports.saltRounds = 10;
const jwtToken = "shhhhhhh";
const checkErrors = (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('errors:', errors);
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.checkErrors = checkErrors;
