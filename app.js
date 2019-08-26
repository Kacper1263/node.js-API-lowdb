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
app.set('port', 5000);

const localtunnel = require('localtunnel');
//----------Tunnel config---------------------//
tunnelSubdomain = 'kacper-api2',               //
tunnelPort = 5000,                            // 
tunnelUrlUWant = 'https://kacper-api2.localtunnel.me'; //Full url for verification is domain in use
//--------------------------------------------//

//#region localtunnel stuff
var tunnel = localtunnel(tunnelPort, {subdomain: tunnelSubdomain}, function(err,tunnel){
    if(err){
      console.log("Error while creating tunnel: " + err);
      process.exit();
    }
  
    console.log("Tunnel started with url: " + tunnel.url + " on port: " + tunnelPort);
  
    if(tunnel.url != tunnelUrlUWant){
      console.log("Error! Subdomain in use!");
      process.exit();
    }
    if(tunnelPort != app.get('port')){
      console.log("Tunnel on different port! API:" + app.get('port') + " tunnel:" + tunnelPort);
    }
  
    console.log("");
});
tunnel.on('close', function(){
    console.log("Tunnel closed!");
    process.exit();
});
var restartingTunnel = false;
tunnel.on('error', function(err){ 
    if(restartingTunnel) return;
    restartingTunnel = true;
    console.log("Error on tunnel. Err: " + err);
    console.log();
    console.log("Restarting tunnel...");
    
    tunnel = localtunnel(tunnelPort, {subdomain: tunnelSubdomain}, function(err,tunnel){
      if(err){
        console.log("Error while creating tunnel: " + err);
        process.exit();
      }
    
      console.log("Tunnel started with url: " + tunnel.url + " on port: " + tunnelPort);
      
      if(tunnel.url != tunnelUrlUWant){
        console.log("Error! Subdomain in use!");
        process.exit();
      }
      if(tunnelPort != app.get('port')){
        console.log("Tunnel on different port! API:" + app.get('port') + " tunnel:" + tunnelPort);
      }
      
      console.log("");
      restartingTunnel = false;
    });
});
//#endregion

//Routes
var routes = require('./routes/index')
app.use('/api/v1/users', routes.getUser);
app.use('/api/v1/users', routes.addtUser);
app.use('/api/v1/users', routes.deleteUser);
app.use('/api/v1/users', routes.editUser);

app.get('/', (req, res) =>{
    res.redirect('/api/v1/users/');
});
app.get('/:id', (req, res) => {
    const idOrName = req.params.id;
    res.redirect('/api/v1/users/' + idOrName);
});

app.listen(app.get('port'), () => {
  console.log('API running on port ' + app.get('port'))
});
