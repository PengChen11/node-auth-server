
'use strict';

const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

const User = require('../src/auth/models/users-model');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeUser = {
  username: 'tester',
  password: 'password',
  role: 'admin',
  email: 'tester@test.com',
};


describe('tests for extra routes', ()=>{

  it('should allow entry with good token', async () => {
    const user = await User.create(fakeUser);

    const token = user.tokenGenerator();

    const response = await mockRequest.get('/secret').auth(token, {type: 'bearer'});
    expect(response.status).toBe(200);
  });

  it('should NOT allow entry with bad token', async () => {

    const response = await mockRequest.get('/secret').auth('bad token', {type: 'bearer'});

    expect(response.status).toBe(500);
  });

});
