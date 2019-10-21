const express = require('express')
const router = express.Router()

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database

router.delete('/:id', (req, res) => {
    db.read();
    const id = parseInt(req.params.id, 10);

    var list = db.get("users").value();
    var success = false;
    var indexToDelete = list.findIndex(user => user.id === id);

    if(indexToDelete != -1){
        success = true;
        var deletedUserName = list[indexToDelete].name;
        if(db.get("users").splice(indexToDelete, 1).write()){
            return res.status(200).send({
                success: 'true',
                message: 'User \''+ deletedUserName +'\' deleted successfuly',
            }); 
        }
        else{
            return res.status(500).send({
                success: 'false',
                message: 'User found but can\'t be deleted',
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