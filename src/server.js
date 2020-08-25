'use strict';
const  express = require('express');
const app = express();

const AuthBase = require('./auth/middleware/auth');

const users = require('./auth/models/users-model');

app.use(express.json());

const router = require('./auth/router');


app.use(router);

const fourOfour = require('./middleware/404');

app.use('*', fourOfour);

const errors = require('./middleware/error');

app.use(errors);



module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3200;
    app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));

  },
};


