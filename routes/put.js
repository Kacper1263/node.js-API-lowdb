const express = require('express')
const router = express.Router()

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    var oldID;
    var oldName;
    var oldDescription;
    if (!req.body.name && !req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'No \'name\' or \'description\' given. Nothing will be changed',
        });
    }


    var list = db.get("users").value();
    var success = false;
    var indexToDelete = list.findIndex(user => user.id === id);

    if(indexToDelete != -1){
        oldID = list[indexToDelete].id;
        oldName = list[indexToDelete].name;
        oldDescription = list[indexToDelete].description;
        success = true;

        const newUser = {
            id: oldID,
            name: req.body.name || oldName,
            description: req.body.description || oldDescription
        }
        if(db.get("users").splice(indexToDelete, 1, newUser).write()){ //Replace old with new
            return res.status(201).send({
                success: 'true',
                message: 'User replaced successfully',
                content: newUser,
            });
        }
        else{
            return res.status(500).send({
                success: 'false',
                message: 'Old user found but can\'t be deleted',
            });
        }
    }

    if(!success){
        return res.status(404).send({
            success: 'false',
            message: 'User not found. Wrong ID',
        });
    }        
});

module.exports = router;