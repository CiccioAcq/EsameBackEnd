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
const supertest_1 = __importDefault(require("supertest"));
require("chai").should();
const app_1 = require("../app");
const Cities_1 = require("../models/Cities");
const jwtToken = "shhhhhhh";
const basicUrl = "/v1/cities";
describe("cities", () => {
    const city = {
        "name": "Torino",
        "populations": 318.493,
        "men": 138.808,
        "women": 192.685,
        "capital": false
    };
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const cityCreated = new Cities_1.City({
            name: city.name,
            populations: city.populations,
            men: city.men,
            women: city.women,
            capital: city.capital,
        });
        yield cityCreated.save();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Cities_1.City.findOneAndDelete({ name: city.name });
    }));
    describe("create city", () => {
        let id;
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Cities_1.City.findByIdAndDelete(id);
        }));
        it("test unsuccess 400 missing brand", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeCity = Object.assign({}, city);
            delete fakeCity.brand;
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(fakeCity);
            status.should.be.equal(400);
        }));
        it("success test 201", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app)
                .post(basicUrl)
                .send(city);
            status.should.be.equal(201);
            body.should.have.property("_id");
            body.should.have.property("name").equal(city.name);
            body.should.have.property("populations").equal(city.populations);
            body.should.have.property("men").equal(city.men);
            body.should.have.property("women").equal(city.women);
            body.should.have.property("capital").equal(city.capital);
            id = body._id;
        }));
    });
    describe("update city", () => {
        let id;
        const newName = "Venezia";
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Cities_1.City.create(city);
            id = p._id.toString();
        }));
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Cities_1.City.findByIdAndDelete(id);
        }));
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(Object.assign(Object.assign({}, city), { name: newName }));
            status.should.be.equal(200);
            body.should.have.property("_id");
            body.should.have.property("name").equal(newName);
        }));
        it("test unsuccess 404 not valid mongoId", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = "a" + id.substring(1);
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${fakeId}`)
                .send(Object.assign(Object.assign({}, city), { name: newName }));
            status.should.be.equal(404);
        }));
        it("test unsuccess 400 missing name", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeCity = Object.assign({}, city);
            delete fakeCity.name;
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(fakeCity);
            status.should.be.equal(400);
        }));
    });
    describe("delete city", () => {
        let id;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Cities_1.City.create(city);
            id = p._id.toString();
        }));
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .delete(`${basicUrl}/${id}`);
            status.should.be.equal(200);
        }));
    });
    describe("get cities", () => {
        let id;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Cities_1.City.create(city);
            id = p._id.toString();
        }));
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Cities_1.City.findByIdAndDelete(id);
        }));
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app).get(`${basicUrl}/${id}`);
            status.should.be.equal(200);
            body.should.have.property("_id");
            body.should.have.property("name").equal(city.name);
            body.should.have.property("populations").equal(city.populations);
            body.should.have.property("men").equal(city.men);
            body.should.have.property("women").equal(city.women);
            body.should.have.property("capital").equal(city.capital);
        }));
        it("test unsuccess 404 not valid mongoId", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = "a" + id.substring(1);
            const { status } = yield (0, supertest_1.default)(app_1.app).get(`${basicUrl}/${fakeId}`);
            status.should.be.equal(404);
        }));
    });
    describe("get cities", () => {
        let ids = [];
        const cities = [
            {
                name: "Milano",
                populations: 318.493,
                men: 138.808,
                women: 192.685,
                capital: false
            },
            {
                name: "Siracusa",
                populations: 318.493,
                men: 138.808,
                women: 192.685,
                capital: false
            },
            {
                name: "Gela",
                populations: 318.493,
                men: 138.808,
                women: 192.685,
                capital: false
            },
        ];
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield Promise.all([
                Cities_1.City.create(cities[0]),
                Cities_1.City.create(cities[1]),
                Cities_1.City.create(cities[2]),
            ]);
            ids = response.map((item) => item._id.toString());
        }));
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                Cities_1.City.findByIdAndDelete(ids[0]),
                Cities_1.City.findByIdAndDelete(ids[1]),
                Cities_1.City.findByIdAndDelete(ids[2]),
            ]);
        }));
    });
});
