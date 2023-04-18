import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  populations: { type: Number, required: true },
  men: { type: Number, required: true },
  women: { type: Number, required: true },
  capital: { type: Boolean, required: true },
  overPopulation: { type: Number, optional: true },
  underPopulation: { type: Number, optional: true },
});

export const City = mongoose.model("City", citySchema);
