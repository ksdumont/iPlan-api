const ListsService = {
    getAllLists(knex) {
        return knex.select('*').from('lists')
    },
    updateLists(knex, id, newFields) {
        return knex('lists')
        .where({id})
        .update(newFields)
    }
}
module.exports = ListsService