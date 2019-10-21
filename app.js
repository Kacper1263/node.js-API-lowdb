const express = require('express');
const bodyParser = require('body-parser');
const versions = require("./versions")

//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
const adapter = new FileSync('users.json')
const db = low(adapter)
//#endregion

db.defaults({ registeredUsers: {}}).write() //default variables for database
// db.set("registeredUsers.12ID51", 1322222).write()


// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes API v1
var routes_v1 = require('./routes/v1/index')
app.use('/api/v1/users', routes_v1.getUser)
app.use('/api/v1/users', routes_v1.addUser)
app.use('/api/v1/users', routes_v1.deleteUser)
app.use('/api/v1/users', routes_v1.editUser)
//Routes API v2
var routes_v2 = require('./routes/v2/index')
app.use('/api/v2/users', routes_v2.getUser)
app.use('/api/v2/users', routes_v2.addUser)
app.use('/api/v2/users', routes_v2.deleteUser)
app.use('/api/v2/users', routes_v2.editUser)
app.use('/api/v2/users', routes_v2.deleteAll)
app.use('/api/v2/register', routes_v2.register)

app.get('/', (req, res) =>{
    res.redirect(`/api/${versions.latestVersion()}/users/`);
});
app.get('/:id', (req, res) => {
    const idOrName = req.params.id;
    res.redirect(`/api/${versions.latestVersion()}/users/` + idOrName);
});

//404
app.use(function(req, res){
  res.status(404).send({success: 'false', code: 404, message: "Page not found!", TIP: `If you are looking for API try /api/${versions.latestVersion()}/users`});
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
});