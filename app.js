const express = require('express');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
var routes_v1 = require('./routes/v1/index')
app.use('/api/v1/users', routes_v1.getUser)
app.use('/api/v1/users', routes_v1.addUser)
app.use('/api/v1/users', routes_v1.deleteUser)
app.use('/api/v1/users', routes_v1.editUser)

app.get('/', (req, res) =>{
    res.redirect('/api/v1/users/');
});
app.get('/:id', (req, res) => {
    const idOrName = req.params.id;
    res.redirect('/api/v1/users/' + idOrName);
});

//404
app.use(function(req, res){
  res.status(404).send({code: 404, description: "Page not found!", TIP: "If you are looking for API try /api/{versionOfAPI}/users"});
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
});