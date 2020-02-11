const express = require("express");
const path = require("path");
const MembersService = require("./members-service");

const membersRouter = express.Router();
const jsonParser = express.json();

membersRouter
  .route("/")
  .get((req, res, next) => {
    MembersService.getAllMembers(req.app.get("db"))
      .then(members => {
        res.json(members);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, trip } = req.body;
    const newMember = { name, trip };

    for (const [key, value] of Object.entries(newMember)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    MembersService.insertMember(req.app.get("db"), newMember)
      .then(member => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${member.id}`))
          .json(member);
      })
      .catch(next);
  });
membersRouter
  .route("/:id")
  .all((req, res, next) => {
    MembersService.getById(req.app.get("db"), req.params.id)
      .then(member => {
        if (!member) {
          return res.status(404).json({
            error: { message: `member doesn't exist` }
          });
        }
        res.member = member;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.member);
  });
module.exports = membersRouter;
