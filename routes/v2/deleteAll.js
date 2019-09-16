const express = require('express')

const router = express.Router()
//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//users db
const usersAdapter = new FileSync('users.json')
const usersDB = low(usersAdapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database
usersDB.defaults({ registeredUsers: {}}).write() //default variables for database

router.delete('/', (req, res) => {
    db.read();

    // TODO: If user is registered and send header in request
    if(db.get("users").remove().write()){
        return res.status(200).send({
            success: 'true',
            message: 'All users deleted successfuly',
        }); 
    }
    else{
        return res.status(500).send({
            success: 'false',
            message: 'Error',
        });
    }
});

module.exports = router;