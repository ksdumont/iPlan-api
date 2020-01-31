const express = require('express')
const path = require('path')
const TasksService = require('./tasks-service')

const tasksRouter = express.Router()
const jsonParser = express.json()

tasksRouter
.route('/')
.get((req, res, next) => {
    TasksService.getAllTasks(req.app.get("db"))
      .then(tasks => {
        res.json(tasks);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { task, member, trip, list } = req.body
    const newTask = { task, member, trip, list }

    for (const [key, value] of Object.entries(newTask)) {
        if (value == null) {
            return res.status(400).json({
                error: {message: `Missing '${key}' in request body`}
            })
        }
    }
    TasksService.insertTask(req.app.get("db"), newTask)
      .then(task => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${task.id}`))
          .json(task);
      })
      .catch(next);
  })
  tasksRouter
  .route('/:id')
  .all((req, res, next) => {
    TasksService.getById(req.app.get("db"), req.params.id)
      .then(task => {
        if (!task) {
          return res
            .status(404)
            .json({ error: { message: `task doesn't exist` } });
        }
        res.task = task;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.task);
  })
  .delete((req, res, next) => {
    TasksService.deleteTask(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

module.exports = tasksRouter