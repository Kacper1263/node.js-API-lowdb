const express = require('express')

const router = express.Router()
//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
//users db
const usersAdapter = new FileSync('users.json')
const usersDB = low(usersAdapter)
//#endregion

usersDB.defaults({ registeredUsers: {}}).write() //default variables for database

router.get('/', (req, res) => {
    usersDB.read();
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace(/\./g, "-") // replace dots with "-"

    if(usersDB.get("registeredUsers."+ip).value() == null){
        usersDB.set("registeredUsers."+ip, {}).write()
        res.send("IP registered successfully.");
    }
    else{
        res.send("This IP exist in DB");
    }
    //TODO: Try to return ip for test
    res.send(ip)
});

module.exports = router;