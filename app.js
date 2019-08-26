const express = require('express');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
var routes = require('./routes/index')
app.use('/api/v1/users', routes.getUser)
app.use('/api/v1/users', routes.addUser)
app.use('/api/v1/users', routes.deleteUser)
app.use('/api/v1/users', routes.editUser)

app.get('/', (req, res) =>{
    res.redirect('/api/v1/users/');
});
app.get('/:id', (req, res) => {
    const idOrName = req.params.id;
    res.redirect('/api/v1/users/' + idOrName);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
});