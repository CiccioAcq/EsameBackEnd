import express from "express";
import { body, header, param, query } from "express-validator";
import { checkErrors } from "./utils";
import { City } from "../models/Cities";
const router = express.Router();



//CREAZIONE CITTA'
router.post(
  "/",
  body("name").exists().isString(),
  body("populations").exists().isNumeric(),
  body("men").exists().isNumeric(),
  body("women").exists().isNumeric(),
  body("capital").exists().isBoolean(),
  checkErrors,
  async (req, res) => {
    const { name, populations, men, women,capital } = req.body;
    const city = new City({ name ,populations, men, women, capital });
    const citySaved = await city.save();
    res.status(201).json(citySaved);
  }
);

//modifica citta

router.put(
  "/:id",
  param("id").isMongoId(),
  body("name").exists().isString(),
  body("populations").exists().isNumeric(),
  body("men").exists().isNumeric(),
  body("women").exists().isNumeric(),
  body("capital").exists().isBoolean(),
  checkErrors,
  async (req, res) => {
    const { id } = req.params;
    const { name, populations, men, women, capital } = req.body;
    try {
      const city = await City.findById(id);
      if (!city) {
        return res.status(404).json({ message: "city not found" });
      }
      city.name = name;
      city.populations = populations;
      city.men = men;
      city.women = women;
      city.capital = capital;
      const citySaved = await city.save();
      res.status(200).json(citySaved);
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

//cancellazione citta
router.delete(
  "/:id",
  param("id").isMongoId(),
  checkErrors,
  
  async (req, res) => {
    const { id } = req.params;
    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ message: "city not found" });
    }
    await City.findByIdAndDelete(id);
    res.json({ message: "city deleted" });
  }
);


// ricerca per id
router.get("/:id", 
param("id").isMongoId(), 
checkErrors, async (req, res) => {
  const { id } = req.params;
  const city = await City.findById(id);
  if (!city) {
    return res.status(404).json({ message: "product not found" });
  }
  res.status(200).json(city);
});



// ricerca di tutte le città
router.get(
  "/",
  body("name").exists().isString(),
  body("populations").exists().isNumeric(),
  body("men").exists().isNumeric(),
  body("women").exists().isNumeric(),
  body("capital").exists().isBoolean(),
  body("underPopulation").optional().isNumeric(),
  body("overPopulation").optional().isNumeric(),
  checkErrors,
  async (req, res) => {
    const cities = await City.find({ ...req.query });
    res.json(cities);
  }
);



router.post(
  "/merge",
  body("city1").exists().isMongoId(),
  body("city2").exists().isMongoId(),
  checkErrors,
  async (req, res) => {
    const { city1, city2 } = req.body;
    try {
      const cityOne = await City.findById(city1);
      const cityTwo = await City.findById(city2);

      if (!cityOne || !cityTwo) {
        return res.status(404).json({ message: "One or both cities not found" });
      }
      const newPopulations = cityOne.populations + cityTwo.populations;
      const newMen = cityOne.men + cityTwo.men;
      const newWomen = cityOne.women + cityTwo.women;
      const mergedCity = new City({
        name: `${cityOne.name} ${cityTwo.name}`,
        populations: newPopulations,
        men: newMen,
        women: newWomen,
        capital: cityOne.capital || cityTwo.capital,
      });
      const citySaved = await mergedCity.save();
      await City.findByIdAndDelete(city1);
      await City.findByIdAndDelete(city2);

      res.status(201).json(citySaved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);



export default router;


