"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    populations: { type: Number, required: true },
    men: { type: Number, required: true },
    women: { type: Number, required: true },
    capital: { type: Boolean, required: true },
    overPopulation: { type: Number, optional: true },
    underPopulation: { type: Number, optional: true },
});
exports.City = mongoose_1.default.model("City", citySchema);
