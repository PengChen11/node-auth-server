'use strict';

require('@code-fellows/supergoose');
const bearerAuth = require('../src/auth/middleware/bearer');
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


describe('tests for bearer auth', ()=>{

  it('should fail with missing headers', async () => {
    let req = {
      headers: {
        authorization: '',
      },
    };

    let res = {};

    let next = jest.fn();

    await bearerAuth(req, res, next);

    expect(next).toHaveBeenCalledWith('Invalid Login: Missing Headers');
  });


  it('should fail with bad token', async () => {
    let req = {
      headers: {
        authorization: 'some made up token',
      },
    };

    let res = {};

    let next = jest.fn();

    await bearerAuth(req, res, next);

    expect(next).toHaveBeenCalledWith('Invalid Login');
  });

  it('should carry on with good token', async () => {

    const user = await User.create(fakeUser);

    const token = user.tokenGenerator();

    let req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    let res = {};

    let next = jest.fn();

    await bearerAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();

  });
});
