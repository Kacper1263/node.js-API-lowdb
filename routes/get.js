const express = require('express')
const router = express.Router()

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database

router.get('/', (req, res) => {
    db.read();
    res.status(200).send({
        success: 'true',
        message: 'Users retrieved successfully. You can search by ID or name',
        content: db.value()
    })
});

router.get('/:id', (req, res) => {  
    const id = parseInt(req.params.id, 10);  
    const name = req.params.id;

    var listLength = db.get("users").size().value();
    var list = db.get("users").value();
    
    var success = false;
    
    if(list != null && listLength != 0){
        list.forEach(user => { //Search by ID
            if (user.id === id) {
                success = true;
                return res.status(200).send({
                    success: 'true',        
                    message: 'User retrieved successfully',        
                    content: user,      
                });    
            } 
        }); 
        if(!success){
            list.forEach(user => {                    //Search by name
                if (user.name === name && !success) { //If success stop checking
                    success = true;                    
                    return res.status(200).send({
                        success: 'true',        
                        message: 'User retrieved successfully',        
                        content: user,      
                    }); 
                } 
            }); 
        }  
    }

    if(!success){
        return res.status(404).send({   
            success: 'false',   
            message: 'User does not exist. Bad id or name',  
        });      
    }    
});

module.exports = router;