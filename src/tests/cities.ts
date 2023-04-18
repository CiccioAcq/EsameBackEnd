import request from "supertest";
require("chai").should();
import { app } from "../app";

import bcrypt from "bcrypt";
import { City, City as citySchema } from "../models/Cities";
import jwt from "jsonwebtoken";
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
    before(async () => {
        const cityCreated = new citySchema({
            name: city.name,
            populations: city.populations,
            men: city.men,
            women: city.women,
            capital: city.capital,
        });
        await cityCreated.save();
    });
    after(async () => {
        await citySchema.findOneAndDelete({ name: city.name });
    });

    describe("create city", () => {
        let id: string;
        after(async () => {
            await City.findByIdAndDelete(id);
        });
        it("test unsuccess 400 missing brand", async () => {
                    const fakeCity = { ...city } as any;
                    delete fakeCity.brand;
                    const { status } = await request(app)
                        .put(`${basicUrl}/${id}`)
                        .send(fakeCity)
                    status.should.be.equal(400);
                });
        it("success test 201", async () => {
            const { status, body } = await request(app)
                .post(basicUrl)
                .send(city)
                
            status.should.be.equal(201);
            body.should.have.property("_id");
            body.should.have.property("name").equal(city.name);
            body.should.have.property("populations").equal(city.populations);
            body.should.have.property("men").equal(city.men);
            body.should.have.property("women").equal(city.women);
            body.should.have.property("capital").equal(city.capital);
            id = body._id;
        });
    });

    describe("update city", () => {
        let id: string;
        const newName = "Venezia";
        before(async () => {
            const p = await City.create(city);
            id = p._id.toString();
        });
        after(async () => {
            await City.findByIdAndDelete(id);
        });

        it("test success 200", async () => {
            const { status, body } = await request(app)
                .put(`${basicUrl}/${id}`)
                .send({ ...city, name: newName })
            status.should.be.equal(200);
            body.should.have.property("_id");
            body.should.have.property("name").equal(newName);
        });

        it("test unsuccess 404 not valid mongoId", async () => {
            const fakeId = "a" + id.substring(1);
            const { status } = await request(app)
                .put(`${basicUrl}/${fakeId}`)
                .send({ ...city, name: newName })
            status.should.be.equal(404);
        });

        it("test unsuccess 400 missing name", async () => {
            const fakeCity = { ...city } as any;
            delete fakeCity.name;
            const { status } = await request(app)
                .put(`${basicUrl}/${id}`)
                .send(fakeCity)
            status.should.be.equal(400);
        });

    });




    describe("delete city", () => {
        let id: string;
        before(async () => {
            const p = await City.create(city);
            id = p._id.toString();
        });
      
        it("test success 200", async () => {
            const { status } = await request(app)
                .delete(`${basicUrl}/${id}`)
            status.should.be.equal(200);
        });
    });

    describe("get cities", () => {
        let id: string;
        before(async () => {
            const p = await City.create(city);
            id = p._id.toString();
        });
        after(async () => {
            await City.findByIdAndDelete(id);
        });
        it("test success 200", async () => {
            const { status, body } = await request(app).get(`${basicUrl}/${id}`);
            status.should.be.equal(200);
            body.should.have.property("_id");
            body.should.have.property("name").equal(city.name);
            body.should.have.property("populations").equal(city.populations);
            body.should.have.property("men").equal(city.men);
            body.should.have.property("women").equal(city.women);
            body.should.have.property("capital").equal(city.capital);
        });
        it("test unsuccess 404 not valid mongoId", async () => {
            const fakeId = "a" + id.substring(1);
            const { status } = await request(app).get(`${basicUrl}/${fakeId}`);
            status.should.be.equal(404);
        });
    });

    describe("get cities", () => {
        let ids: string[] = [];
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
        before(async () => {
            const response = await Promise.all([
                City.create(cities[0]),
                City.create(cities[1]),
                City.create(cities[2]),
            ]);
            ids = response.map((item) => item._id.toString());
        });
        after(async () => {
            await Promise.all([
                City.findByIdAndDelete(ids[0]),
                City.findByIdAndDelete(ids[1]),
                City.findByIdAndDelete(ids[2]),
            ]);
        });    
    });




});
