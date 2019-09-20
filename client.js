const request = require('request-promise');

//Client example

async function getUser(user){
    var time = Date.now();
    console.log("Sending...\n");
    await request('https://kacper-api.localtunnel.me/api/v2/users/'+user, {json: true, simple: false, timeout: 120000}).then(body => {
        var success = body.success;
        if(success == "true"){
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log("\nID: " + body.content.id);
            console.log("Name: " + body.content.name);
            console.log("Description: " + body.content.description);
            console.log(Date.now() - time + "ms")
        }
        else{
            if(body.success === undefined || body.message === undefined){
                return console.log(body)
            }
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log(Date.now() - time + "ms")
        }        
    }).catch(err =>{
        console.log(err);
    });
};

async function getAll(){
    var time = Date.now()
    console.log("Sending...\n");
    await request('https://kacper-api.localtunnel.me/api/v2/users/', {json: true, simple: false, timeout: 120000}).then(body => {
        var success = body.success;
        if(success == "true"){
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            var content = body.content.users;
            console.log("\nContent: \n" + JSON.stringify(content, null, 3));
            if(content.length > 0) console.log("Last user name: " + content[content.length - 1].name);
            console.log(Date.now() - time + "ms")
        }
        else{
            if(body.success === undefined || body.message === undefined){
                return console.log(body)
            }
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log(Date.now() - time + "ms")
        }        
    }).catch(err =>{
        console.log(err);
    });
};

async function addUser(name, description){
    var time = Date.now();
    console.log("Sending...\n");
    await request('https://kacper-api.localtunnel.me/api/v2/users/', {
        json: true, // Output as JSON
        method: 'POST',
        timeout: 120000,
        simple: false, //Get a rejection only if the request failed for technical reasons
        body: {
            name: name,
            description: description
        }
    }).then(body => {
        var success = body.success;
        if(success == "true"){
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log("\nNew user:");
            console.log("ID: " + body.content.id);
            console.log("Name: " + body.content.name);
            console.log("Description: " + body.content.description);
            console.log(Date.now() - time + "ms")
        }
        else{
            if(body.success === undefined || body.message === undefined){
                return console.log(body)
            }
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log(Date.now() - time + "ms")
        }  
    }).catch(err =>{
        console.log(err);
    });
};

async function deleteUser(user){
    var time = Date.now();
    console.log("Sending...\n");
    await request('https://kacper-api.localtunnel.me/api/v2/users/'+user, {
        json: true, 
        simple: false, 
        timeout: 120000,
        method: "DELETE"
    }).then(body => {
        var success = body.success;
        if(success == "true"){
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log(Date.now() - time + "ms")
        }
        else{
            if(body.success === undefined || body.message === undefined){
                return console.log(body)
            }
            console.log("Success: " + body.success);
            console.log("Message: " + body.message);
            console.log(Date.now() - time + "ms")
        }        
    }).catch(err =>{
        console.log(err);
    });
};

async function register() {
    var time = Date.now();
    console.log("Sending...\n");
    await request("https://kacper-api.localtunnel.me/api/v2/register/", {
      json: true,
      simple: false,
      timeout: 120000
    })
      .then(body => {
        var success = body.success;
        if (success == "true") {
          console.log("Success: " + body.success);
          console.log("Message: " + body.message);
          var content = body.content.users;
          console.log("\nContent: \n" + JSON.stringify(content, null, 3));
          if (content.length > 0)
            console.log("Last user name: " + content[content.length - 1].name);
          console.log(Date.now() - time + "ms");
        } else {
          if (body.success === undefined || body.message === undefined) {
            return console.log(body);
          }
          console.log("Success: " + body.success);
          console.log("Message: " + body.message);
          console.log(Date.now() - time + "ms");
        }
      })
      .catch(err => {
        console.log(err);
      });
}


if (process.argv[2] == "getUser"){ //[0] is node, [1] is path, [2] is first argument 
    getUser(process.argv[3])
}
else if(process.argv[2] == "getAll") {
    getAll()
}
else if(process.argv[2] == "addUser") {
    addUser(process.argv[3], process.argv[4])
}
else if(process.argv[2] == "deleteUser") {
    deleteUser(process.argv[3])
} else if (process.argv[2] == "register") {
    register();
} else console.log("Use with argument: \ngetUser <ID>, \ngetAll, \naddUser <Name> <Description>, \ndeleteUser <ID>, \nregister");
//getUser(2);
//getAll()
//addUser("Client", "Client script");
