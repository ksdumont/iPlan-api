const MembersService = {
    getAllMembers(knex) {
        return knex.select('*').from('members')
    },
    insertMember(knex, newMember) {
        return knex
        .insert(newMember)
        .into('members')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getById(knex, id) {
        return knex
        .from('members')
        .select('*')
        .where('id', id)
        .first()
    },
 }
module.exports = MembersService