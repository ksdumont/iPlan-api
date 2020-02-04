const knex = require("knex");
const { expect } = require('chai')
const fixtures = require("./iPlan-fixtures");
const app = require("../src/app");
require('dotenv').config()

describe("iPlan Endpoints", () => {
    let db;
  
    before("make knex instance", () => {
      db = knex({
        client: "pg",
        connection: process.env.TEST_DB_URL
      });
      app.set("db", db);
    });
    after("disconnect from db", () => db.destroy());
  
    before("cleanup", () => db("iPlan-test").truncate());
  
    afterEach("cleanup", () => db("iPlan-test").truncate());

    describe("GET /api/lists", () => {
        context(`Given no lists`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get("/api/lists")
              .expect(200, []);
          })
        })
        context(`Given there are lists in the database`, () => {
          const testLists = fixtures.makeListsArray();
    
          beforeEach("insert lists", () => {
            return db.into("iPlan-test").insert(testLists);
          });
    
          it("gets the lists", () => {
            return supertest(app)
              .get("/api/lists")
              .orderBy("id")
              .expect(200, testLists);
          });
        });
    })
})
  