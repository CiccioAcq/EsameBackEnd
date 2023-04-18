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
    // describe("update product", () => {
    //     let id: string;
    //     const newBrand = "google";
    //     before(async () => {
    //         const p = await Product.create(product);
    //         id = p._id.toString();
    //     });
    //     after(async () => {
    //         await Product.findByIdAndDelete(id);
    //     });
    //     it("test failed 401", async () => {
    //         const { status } = await request(app)
    //             .put(`${basicUrl}/${id}`)
    //             .send({ ...product, brand: newBrand });
    //         status.should.be.equal(401);
    //     });
    //     it("test success 200", async () => {
    //         const { status, body } = await request(app)
    //             .put(`${basicUrl}/${id}`)
    //             .send({ ...product, brand: newBrand })
    //             .set({ authorization: token });
    //         status.should.be.equal(200);
    //         body.should.have.property("_id");
    //         body.should.have.property("name").equal(product.name);
    //         body.should.have.property("brand").equal(newBrand);
    //         body.should.have.property("price").equal(product.price);
    //     });
    //     it("test unsuccess 404 not valid mongoId", async () => {
    //         const fakeId = "a" + id.substring(1);
    //         const { status } = await request(app)
    //             .put(`${basicUrl}/${fakeId}`)
    //             .send({ ...product, brand: newBrand })
    //             .set({ authorization: token });
    //         status.should.be.equal(404);
    //     });
    //     it("test unsuccess 400 missing brand", async () => {
    //         const fakeProduct = { ...product } as any;
    //         delete fakeProduct.brand;
    //         const { status } = await request(app)
    //             .put(`${basicUrl}/${id}`)
    //             .send(fakeProduct)
    //             .set({ authorization: token });
    //         status.should.be.equal(400);
    //     });
    //     it("test unsuccess 400 price not number", async () => {
    //         const fakeProduct = { ...product } as any;
    //         fakeProduct.price = "pippo";
    //         const { status } = await request(app)
    //             .put(`${basicUrl}/${id}`)
    //             .send(fakeProduct)
    //             .set({ authorization: token });
    //         status.should.be.equal(400);
    //     });
    // });
    // describe("delete product", () => {
    //     let id: string;
    //     before(async () => {
    //         const p = await Product.create(product);
    //         id = p._id.toString();
    //     });
    //     it("test failed 401", async () => {
    //         const { status } = await request(app).delete(`${basicUrl}/${id}`);
    //         status.should.be.equal(401);
    //     });
    //     it("test success 200", async () => {
    //         const { status } = await request(app)
    //             .delete(`${basicUrl}/${id}`)
    //             .set({ authorization: token });
    //         status.should.be.equal(200);
    //     });
    // });
    // describe("get product", () => {
    //     let id: string;
    //     before(async () => {
    //         const p = await Product.create(product);
    //         id = p._id.toString();
    //     });
    //     after(async () => {
    //         await Product.findByIdAndDelete(id);
    //     });
    //     it("test success 200", async () => {
    //         const { status, body } = await request(app).get(`${basicUrl}/${id}`);
    //         status.should.be.equal(200);
    //         body.should.have.property("_id").equal(id);
    //         body.should.have.property("name").equal(product.name);
    //         body.should.have.property("brand").equal(product.brand);
    //         body.should.have.property("price").equal(product.price);
    //     });
    //     it("test unsuccess 404 not valid mongoId", async () => {
    //         const fakeId = "a" + id.substring(1);
    //         const { status } = await request(app).get(`${basicUrl}/${fakeId}`);
    //         status.should.be.equal(404);
    //     });
    // });
    // describe("get products", () => {
    //     let ids: string[] = [];
    //     const products = [
    //         {
    //             name: "iphone14",
    //             brand: "apple",
    //             price: 1200,
    //         },
    //         {
    //             name: "s22",
    //             brand: "samsung",
    //             price: 100,
    //         },
    //         {
    //             name: "s22",
    //             brand: "motorola",
    //             price: 300,
    //         },
    //     ];
    //     before(async () => {
    //         const response = await Promise.all([
    //             Product.create(products[0]),
    //             Product.create(products[1]),
    //             Product.create(products[2]),
    //         ]);
    //         ids = response.map((item) => item._id.toString());
    //     });
    //     after(async () => {
    //         await Promise.all([
    //             Product.findByIdAndDelete(ids[0]),
    //             Product.findByIdAndDelete(ids[1]),
    //             Product.findByIdAndDelete(ids[2]),
    //         ]);
    //     });
    //     it("test success 200", async () => {
    //         const { status, body } = await request(app).get(basicUrl);
    //         status.should.be.equal(200);
    //         body.should.have.property("length").equal(products.length);
    //     });
    //     it("test success 200 with query params", async () => {
    //         const { status, body } = await request(app).get(
    //             `${basicUrl}?brand=apple`
    //         );
    //         status.should.be.equal(200);
    //         body.should.have.property("length").equal(1);
    //     });
    // });
});
