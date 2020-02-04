CREATE TABLE members (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    trip INTEGER REFERENCES trips(id) ON DELETE RESTRICT NOT NULL
);