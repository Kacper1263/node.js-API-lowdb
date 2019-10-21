const express = require('express')

const router = express.Router()
//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
//users db
const usersAdapter = new FileSync('users.json')
const usersDB = low(usersAdapter)
//#endregion

const functions = require('./functions/index')

usersDB.defaults({ registeredUsers: {}}).write() //default variables for database

router.get('/', (req, res) => {
    usersDB.read();
    var ip = functions.isIpRegistered(req).ip
    if(!functions.isIpRegistered(req).registered){
        usersDB.set("registeredUsers."+ip, {}).write()
        res.send("IP registered successfully.\nIP: " + ip);
    }
    else{
        res.send("This IP exist in DB");
    }
});

module.exports = router;