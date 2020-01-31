const express = require('express')
const ListsService = require('./lists-services')

const listsRouter = express.Router()
const jsonParser = express.json()

listsRouter
.route('/')
.get((req, res, next) => {
    ListsService.getAllLists(req.app.get('db'))
    .then(lists => {
        res.json(lists)
    })
    .catch(next)
})
listsRouter
.route('/:id')
.patch(jsonParser, (req, res, next) => {
    const {displayaddtaskform} = req.body
    const updateField = {displayaddtaskform}
    ListsService.updateLists(req.app.get('db'), req.params.id, updateField)
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = listsRouter;