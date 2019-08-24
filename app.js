const express = require('express');
const bodyParser = require('body-parser');

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('db.json')
const db = low(adapter)
//#endregion

db.defaults({ users: []}).write() //default variables for database

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{
    res.redirect('/api/v1/users/');
});
app.get('/:id', (req, res) => {
    const idOrName = req.params.id;
    res.redirect('/api/v1/users/' + idOrName);
});

// get all users
app.get('/api/v1/users', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Users retrieved successfully. You can search by ID or name',
    content: db.value()
  })
});

app.post('/api/v1/users', (req, res) => {
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

app.get('/api/v1/users/:id', (req, res) => {  
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

app.delete('/api/v1/users/:id', (req, res) => {
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

app.put('/api/v1/users/:id', (req, res) => {
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



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
});