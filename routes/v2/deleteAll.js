const express = require('express')

const router = express.Router()
//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

const functions = require('./functions/index')

db.defaults({ users: []}).write() //default variables for database

router.delete('/', (req, res) => {
    db.read();

    //You must be registered and "ConfirmDelete" header is required to delete all users from db
    if(functions.isIpRegistered(req).registered && req.header("ConfirmDelete") == "true"){
        if(db.get("users").remove().write()){
            if(db.defaults({ users: []}).write()){
                functions.addDeletionToUserStats(req)
                return res.status(200).send({
                    success: 'true',
                    message: 'All users deleted successfuly',
                }); 
            } else{
                return res.status(500).send({
                    success: 'false',
                    message: 'Error while deleting',
                });
            }

        } else{
            return res.status(500).send({
                success: 'false',
                message: 'Error while deleting',
            });
        }
    }
    else{
        if(!functions.isIpRegistered(req).registered){
            return res.status(403).send({
                success: 'false',
                message: 'You must be registered! Use /api/v2/register',
            });
        }
        else if(req.header("ConfirmDelete") != "true"){
            return res.status(403).send({
                success: 'false',
                message: 'You must set header \'ConfirmDelete\' to \'true\'!',
            });
        }
        else{
            return res.status(500).send({
                success: 'false',
                message: 'Something went wrong. It\'s probably not your fault',
            });
        }        
    }    
});

module.exports = router;