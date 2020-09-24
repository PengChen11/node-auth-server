'use strict';

process.env.SECRET = 'wocaowocao';

const jwt = require('jsonwebtoken');
const server = require('../src/server').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);


describe('Router tests', () => {

  describe(`users signup/in`, () => {

    it('can sign up', async () => {

      const userData = { username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' };

      const results = await mockRequest.post('/signup').send(userData);

      const token = await jwt.verify(results.text, process.env.SECRET);

      expect(token.id).toBeDefined();

    });

    it('can signin with basic', async () => {

      const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

      await mockRequest.post('/signup').send(userData);

      const results = await mockRequest.post('/signin').auth('joey', 'password');

      const token = jwt.verify(results.text, process.env.SECRET);

      expect(token).toBeDefined();

    });

    it('can get 404 error for non exsiting route', async ()=>{
      const badReq = await mockRequest.get('/bad_route');
      expect(badReq.status).toBe(404);
    });

  });


});
