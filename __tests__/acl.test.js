
'use strict';

const { server } = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const User = require('../src/auth/models/users-model');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeAdmin = {
  username: 'fakeAdmin',
  password: 'password',
  role: 'admin',
  email: 'fakeadmin@test.com',
};

const fakeUser = {
  username: 'fakeUser',
  password: 'password',
  role: 'user',
  email: 'fakeuser@test.com',
};

const fakeEditor = {
  username: 'fakeEditor',
  password: 'password',
  role: 'editor',
  email: 'fakeEditor@test.com',
};


const fakeWriter = {
  username: 'fakeWriter',
  password: 'password',
  role: 'writer',
  email: 'fakeWriter@test.com',
};

const runTest= async (userSample, route, method)=>{
  const newUser = await User.create(userSample);
  const token = newUser.tokenGenerator();
  if (method === 'get') return await mockRequest.get(`/api/v2/${route}`).auth(token, {type: 'bearer'});
  if (method === 'post') return await mockRequest.post(`/api/v2/${route}`).auth(token, {type: 'bearer'});
  if (method === 'put') return await mockRequest.put(`/api/v2/${route}`).auth(token, {type: 'bearer'});
  if (method === 'delete') return await mockRequest.delete(`/api/v2/${route}`).auth(token, {type: 'bearer'});
};


describe('tests for extra routes', ()=>{

  it('Everyone can read', async ()=>{

    expect((await runTest(fakeAdmin, 'readonly', 'get')).status).toBe(200);
    expect((await runTest(fakeUser, 'readonly', 'get')).status).toBe(200);
    expect((await runTest(fakeEditor, 'readonly', 'get')).status).toBe(200);
    expect((await runTest(fakeWriter, 'readonly', 'get')).status).toBe(200);

  });



  it('admin, editor and writer can create', async ()=>{

    expect((await runTest(fakeAdmin, 'create', 'post')).status).toBe(200);
    expect((await runTest(fakeUser, 'create', 'post')).status).toBe(500);
    expect((await runTest(fakeEditor, 'create', 'post')).status).toBe(200);
    expect((await runTest(fakeWriter, 'create', 'post')).status).toBe(200);

  });

  it('admin and editor can update', async ()=>{

    expect((await runTest(fakeAdmin, 'update', 'put')).status).toBe(200);
    expect((await runTest(fakeUser, 'update', 'put')).status).toBe(500);
    expect((await runTest(fakeEditor, 'update', 'put')).status).toBe(200);
    expect((await runTest(fakeWriter, 'update', 'put')).status).toBe(500);

  });

  it('only admin can update', async ()=>{

    expect((await runTest(fakeAdmin, 'delete', 'delete')).status).toBe(200);
    expect((await runTest(fakeUser, 'delete', 'delete')).status).toBe(500);
    expect((await runTest(fakeEditor, 'delete', 'delete')).status).toBe(500);
    expect((await runTest(fakeWriter, 'delete', 'delete')).status).toBe(500);

  });
});
