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
    //after("disconnect from db", () => db.destroy());
  
    before("cleanup", () => db("iPlan-test").truncate());
  
    //afterEach("cleanup", () => db("iPlan-test").truncate());

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

    describe("GET /api/trips", () => {
      context(`Given no trips`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get("/api/trips")
            .expect(200, []);
        })
      })
      context(`Given there are trips in the database`, () => {
        const testTrips = fixtures.makeTripsArray();
  
        beforeEach("insert trips", () => {
          return db.into("iPlan-test").insert(testTrips);
        });
  
        it("gets the trips", () => {
          return supertest(app)
            .get("/api/trips")
            .expect(200, testTrips);
        });
      });
  })
  describe("GET /api/members", () => {
    context(`Given no members`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/members")
          .expect(200, []);
      })
    })
    context(`Given there are members in the database`, () => {
      const testMembers = fixtures.makeMembersArray();

      beforeEach("insert members", () => {
        return db.into("iPlan-test").insert(testMembers);
      });

      it("gets the members", () => {
        return supertest(app)
          .get("/api/members")
          .expect(200, testMembers);
      });
    });
})
describe("GET /api/tasks", () => {
  context(`Given no tasks`, () => {
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get("/api/tasks")
        .expect(200, []);
    })
  })
  context(`Given there are tasks in the database`, () => {
    const testTasks = fixtures.makeTasksArray();

    beforeEach("insert tasks", () => {
      return db.into("iPlan-test").insert(testTasks);
    });

    it("gets the tasks", () => {
      return supertest(app)
        .get("/api/tasks")
        .expect(200, testTasks);
    });
  });
})
})
  