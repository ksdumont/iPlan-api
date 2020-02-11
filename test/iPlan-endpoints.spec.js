const knex = require("knex");
const { expect } = require("chai");
const fixtures = require("./iPlan-fixtures");
const app = require("../src/app");
require("dotenv").config();

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

  before("cleanup", () =>
    db.raw("TRUNCATE tasks, members, trips, lists RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE tasks, members, trips, lists RESTART IDENTITY CASCADE")
  );

  describe("GET /api/lists", () => {
    context(`Given no lists`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/lists")
          .expect(200, []);
      });
    });
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
  });
  describe("GET /api/trips", () => {
    context(`Given no trips`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/trips")
          .expect(200, []);
      });
    });
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
  });
  describe(`GET /api/trips/:id`, () => {
    context(`given no trips`, () => {
      it(`responds with 404 when trip doesn't exist`, () => {
        return supertest(app)
          .get("/api/trips/123")
          .expect(404, { error: { message: `Trip doesn't exist` } });
      });
    });
    context(`given there are trips in database`, () => {
      const testTrips = fixtures.makeTripsArray();

      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });
      it(`responds with 200 and the specified trip`, () => {
        const tripId = 2;
        const expectedTrip = testTrips[tripId - 1];
        return supertest(app)
          .get(`/api/trips/${tripId}`)
          .expect(200, expectedTrip);
      });
    });
  });
  describe("POST /api/trips", () => {
    it(`adds a new trip to the database`, () => {
      const newTrip = {
        title: "Denmark"
      };
      return supertest(app)
        .post("/api/trips")
        .send(newTrip)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newTrip.title);
          expect(res.headers.location).to.eql(`/api/trips/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/trips/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
  describe("GET /api/members", () => {
    context(`Given no members`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/members")
          .expect(200, []);
      });
    });
    context(`Given there are members in the database`, () => {
      const testMembers = fixtures.makeMembersArray();
      const testTrips = fixtures.makeTripsArray();

      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });

      beforeEach("insert members", () => {
        return db.into("members").insert(testMembers);
      });

      it("gets the members", () => {
        return supertest(app)
          .get("/api/members")
          .expect(200, testMembers);
      });
    });
  });
  describe(`GET /api/members/:id`, () => {
    context(`given no members`, () => {
      it(`responds with 404 when member doesn't exist`, () => {
        return supertest(app)
          .get("/api/members/123")
          .expect(404, { error: { message: `member doesn't exist` } });
      });
    });
    context(`given there are members in database`, () => {
      const testMembers = fixtures.makeMembersArray();
      const testTrips = fixtures.makeTripsArray();

      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });

      beforeEach("insert members", () => {
        return db.into("members").insert(testMembers);
      });
      it(`responds with 200 and the specified member`, () => {
        const memberId = 2;
        const expectedMember = testMembers[memberId - 1];
        return supertest(app)
          .get(`/api/members/${memberId}`)
          .expect(200, expectedMember);
      });
    });
  });
  describe("POST /api/members", () => {
    const testTrips = fixtures.makeTripsArray();

    beforeEach("insert trips", () => {
      return db.into("trips").insert(testTrips);
    });
    it(`adds a new member to the database`, () => {
      const newMember = {
        name: "jason",
        trip: 1
      };
      return supertest(app)
        .post("/api/members")
        .send(newMember)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newMember.name);
          expect(res.body.trip).to.eql(newMember.trip);
          expect(res.headers.location).to.eql(`/api/members/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/members/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
  describe("GET /api/tasks", () => {
    context(`Given no tasks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/tasks")
          .expect(200, []);
      });
    });
    context(`Given there are tasks in the database`, () => {
      const testTasks = fixtures.makeTasksArray();
      const testMembers = fixtures.makeMembersArray();
      const testTrips = fixtures.makeTripsArray();
      const testLists = fixtures.makeListsArray();
  
      beforeEach("insert lists", () => {
        return db.into("lists").insert(testLists);
      });
  
      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });
  
      beforeEach("insert members", () => {
        return db.into("members").insert(testMembers);
      });

      beforeEach("insert tasks", () => {
        return db.into("tasks").insert(testTasks);
      });

      it("gets the tasks", () => {
        return supertest(app)
          .get("/api/tasks")
          .expect(200, testTasks);
      });
    });
  });
  describe("POST /api/tasks", () => {
    const testMembers = fixtures.makeMembersArray();
    const testTrips = fixtures.makeTripsArray();
    const testLists = fixtures.makeListsArray();

    beforeEach("insert lists", () => {
      return db.into("lists").insert(testLists);
    });

    beforeEach("insert trips", () => {
      return db.into("trips").insert(testTrips);
    });

    beforeEach("insert members", () => {
      return db.into("members").insert(testMembers);
    });

    it(`adds a new task to the database`, () => {
      const newTask = {
        task: "food",
        member: 1,
        trip: 2,
        list: 1
      };
      return supertest(app)
        .post("/api/tasks")
        .send(newTask)
        .expect(201)
        .expect(res => {
          expect(res.body.task).to.eql(newTask.task);
          expect(res.body.member).to.eql(newTask.member);
          expect(res.body.trip).to.eql(newTask.trip);
          expect(res.body.list).to.eql(newTask.list);
          expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/tasks/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
  describe(`GET /api/tasks/:id`, () => {
    context(`given no tasks`, () => {
      it(`responds with 404 when task doesn't exist`, () => {
        return supertest(app)
          .get("/api/tasks/123")
          .expect(404, { error: { message: `task doesn't exist` } });
      });
    });
    context(`given there are tasks in database`, () => {
      const testTasks = fixtures.makeTasksArray();
      const testMembers = fixtures.makeMembersArray();
      const testTrips = fixtures.makeTripsArray();
      const testLists = fixtures.makeListsArray();
  
      beforeEach("insert lists", () => {
        return db.into("lists").insert(testLists);
      });
  
      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });
  
      beforeEach("insert members", () => {
        return db.into("members").insert(testMembers);
      });

      beforeEach("insert tasks", () => {
        return db.into("tasks").insert(testTasks);
      });
      it(`responds with 200 and the specified task`, () => {
        const taskId = 2;
        const expectedTask = testTasks[taskId - 1];
        return supertest(app)
          .get(`/api/tasks/${taskId}`)
          .expect(200, expectedTask);
      });
    });
  });
  describe(`DELETE /api/tasks/:id`, () => {
    context(`Given there are tasks`, () => {
      const testTasks = fixtures.makeTasksArray();
      const testMembers = fixtures.makeMembersArray();
      const testTrips = fixtures.makeTripsArray();
      const testLists = fixtures.makeListsArray();
  
      beforeEach("insert lists", () => {
        return db.into("lists").insert(testLists);
      });
  
      beforeEach("insert trips", () => {
        return db.into("trips").insert(testTrips);
      });
  
      beforeEach("insert members", () => {
        return db.into("members").insert(testMembers);
      });

      beforeEach("insert tasks", () => {
        return db.into("tasks").insert(testTasks);
      });
      it("removes the task from database", () => {
        const idToRemove = 2;
        const expectedTasks = testTasks.filter(t => t.id !== idToRemove);
        return supertest(app)
          .delete(`/api/tasks/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`api/tasks`)
              .expect(expectedTasks)
          )
      });
    });
  });
});
