const express = require('express')
const router = express.Router()

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database

router.post('/', (req, res) => {
    db.read()
    if(!req.body.name) {
        return res.status(400).send({
            success: 'false',
            message: '\'name\' is required'
        });
    } 
    else if(!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: '\'description\' is required'
        });
    }
    
    //To prevent ID duplication after removing a few old ones, each new ID will be 1 greater than the ID of the last object on the list.
    var list = db.get("users").value();
    var lastObject = list[list.length - 1];
    var newID;
    if(lastObject == undefined){
        newID = 1;
    }
    else{
        newID = lastObject.id + 1;
    }
    const user = {
        id: newID,
        name: req.body.name,
        description: req.body.description
    }

    db.get("users").push(user).write();
    return res.status(201).send({
        success: 'true',
        message: 'User added successfully',
        content: user
    })
    
});

module.exports = router;