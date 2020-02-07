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

    // before(knex.raw('SET foreign_key_checks = 0'))
    // before(knex.truncate())
    // before(knex.raw('SET foreign_key_checks = 1'))
    // db("iPlan-test").raw('SET foreign_key_checks = 0');
    // db.truncate(); 
     
  after("disconnect from db", () => db.destroy());
  before("cleanup", () => db("iPlan-test").raw('TRUNCATE TABLE lists'));
  afterEach("cleanup", () => db("iPlan-test").raw('TRUNCATE TABLE lists'));

  

    describe.only("GET /api/lists", () => {
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
            return db.into("lists").insert(testLists);
          });
    
          it("gets the lists", () => {
            return supertest(app)
              .get("/api/lists")
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
          return db.into("trips").insert(testTrips);
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
        return db.into("members").insert(testMembers);
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
      return db.into("tasks").insert(testTasks);
    });

    it("gets the tasks", () => {
      return supertest(app)
        .get("/api/tasks")
        .expect(200, testTasks);
    });
  });
})
})
  