"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const utils_1 = require("./utils");
const Cities_1 = require("../models/Cities");
const router = express_1.default.Router();
//CREAZIONE CITTA'
router.post("/", (0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("populations").exists().isNumeric(), (0, express_validator_1.body)("men").exists().isNumeric(), (0, express_validator_1.body)("women").exists().isNumeric(), (0, express_validator_1.body)("capital").exists().isBoolean(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, populations, men, women, capital } = req.body;
    const city = new Cities_1.City({ name, populations, men, women, capital });
    const citySaved = yield city.save();
    res.status(201).json(citySaved);
}));
//modifica citta
router.put("/:id", (0, express_validator_1.param)("id").isMongoId(), (0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("populations").exists().isNumeric(), (0, express_validator_1.body)("men").exists().isNumeric(), (0, express_validator_1.body)("women").exists().isNumeric(), (0, express_validator_1.body)("capital").exists().isBoolean(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, populations, men, women, capital } = req.body;
    try {
        const city = yield Cities_1.City.findById(id);
        if (!city) {
            return res.status(404).json({ message: "city not found" });
        }
        city.name = name;
        city.populations = populations;
        city.men = men;
        city.women = women;
        city.capital = capital;
        const citySaved = yield city.save();
        res.status(200).json(citySaved);
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
//cancellazione citta
router.delete("/:id", (0, express_validator_1.param)("id").isMongoId(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const city = yield Cities_1.City.findById(id);
    if (!city) {
        return res.status(404).json({ message: "city not found" });
    }
    yield Cities_1.City.findByIdAndDelete(id);
    res.json({ message: "city deleted" });
}));
// ricerca per id
router.get("/:id", (0, express_validator_1.param)("id").isMongoId(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const city = yield Cities_1.City.findById(id);
    if (!city) {
        return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(city);
}));
// ricerca di tutte le città
router.get("/", (0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("populations").exists().isNumeric(), (0, express_validator_1.body)("men").exists().isNumeric(), (0, express_validator_1.body)("women").exists().isNumeric(), (0, express_validator_1.body)("capital").exists().isBoolean(), (0, express_validator_1.body)("underPopulation").optional().isNumeric(), (0, express_validator_1.body)("overPopulation").optional().isNumeric(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cities = yield Cities_1.City.find(Object.assign({}, req.query));
    res.json(cities);
}));
router.post("/merge", (0, express_validator_1.body)("city1").exists().isMongoId(), (0, express_validator_1.body)("city2").exists().isMongoId(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city1, city2 } = req.body;
    try {
        const cityOne = yield Cities_1.City.findById(city1);
        const cityTwo = yield Cities_1.City.findById(city2);
        if (!cityOne || !cityTwo) {
            return res.status(404).json({ message: "One or both cities not found" });
        }
        const newPopulations = cityOne.populations + cityTwo.populations;
        const newMen = cityOne.men + cityTwo.men;
        const newWomen = cityOne.women + cityTwo.women;
        const mergedCity = new Cities_1.City({
            name: `${cityOne.name} ${cityTwo.name}`,
            populations: newPopulations,
            men: newMen,
            women: newWomen,
            capital: cityOne.capital || cityTwo.capital,
        });
        const citySaved = yield mergedCity.save();
        yield Cities_1.City.findByIdAndDelete(city1);
        yield Cities_1.City.findByIdAndDelete(city2);
        res.status(201).json(citySaved);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
