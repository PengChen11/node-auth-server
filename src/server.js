'use strict';
const  express = require('express');
const app = express();

app.use(express.static('./public'));
app.use(express.json());

const router = require('./auth/router');

app.use(router);

const extraRoutes = require('./v2_routes');

app.use('/api/v2', extraRoutes);

const fourOfour = require('./middleware/404');

app.use('*', fourOfour);

const errors = require('./middleware/error');

app.use(errors);

module.exports = {
  server: app,
  start: port => {
    let PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));

  },
};


