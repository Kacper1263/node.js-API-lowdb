# Node.js API supporting database (lowdb) with users
<br/>

## How to install
 
 - Clone repo
 - Go to main folder (with app.js)
 - Run <b>npm install</b> from command line
 
 <br/>
 
## How to run
 
 - Run <b>node app.js</b> in the main folder
 
 <br/>
 
## API usage

 ### Get all users
  Send GET request to <b>.../api/v1/users</b>
 ### Get one user
  - Send GET request to <b>.../api/v1/users/:id</b>
  - Send GET request to <b>.../api/v1/users/:name (It will take the first user it finds!)</b>
  
  e.g. <b>localhost:5000/api/v1/users/4</b> or <b>localhost:5000/api/v1/users/kacper</b>
  
 ### Add user
  Send POST request to <b>.../api/v1/users/</b> <br/>
  <br/>
  In body provide:
   - name
   - description

 ### Delete user
  Send DELETE request to <b>.../api/v1/users/:id</b>
 
 ### Edit user data
  Send PUT request to <b>.../api/v1/users/:id</b>
  
  In body provide <b>name</b> or <b>description</b>. Information that will not be given will be loaded from the old content.
  <br/><br/><br/>

The project uses [lowdb](https://www.npmjs.com/package/lowdb) as a database.
