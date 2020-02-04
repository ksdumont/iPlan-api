function makeListsArray() {
    return [
        {id: 1, title: "To Do", displayaddtaskform: false},
        {id: 2, title: "Assigned", displayaddtaskform: false},
        {id: 3, title: "Done", displayaddtaskform: false}
    ]
}
function makeTripsArray() {
    return [
        {id: 1, title: "Trip One"},
        {id: 2, title: "Trip Two"},
        {id: 3, title: "Trip Three"}
    ]
}
function makeMembersArray() {
    return [
        {id: 1, name: "Keith", trip: 1},
        {id: 2, name: "Mika", trip: 2},
        {id: 3, name: "Joe", trip: 3}
    ]
}
function makeTasksArray() {
    return [
        {id: 1, task: "Get Beer", member: 1, trip: 1, list: 1},
        {id: 2, task: "Book House", member: 2, trip: 2, list: 2},
        {id: 3, task: "Book Flights", member: 3, trip: 3, list: 3}
    ]
}
module.exports = {
    makeListsArray,
    makeTripsArray,
    makeMembersArray,
    makeTasksArray
}