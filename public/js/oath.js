'use strict';

let URL = 'https://github.com/login/oauth/authorize';

let options = {
  client_id: '371528c4dbf93bed8e02',
  redirect_uri: 'http://localhost:3000/oauth',
  scope: 'read:user',
  state: '401appconsent',
};

let QueryString = Object.keys(options).map((key) => {
  return `${key}=` + encodeURIComponent(options[key]);
}).join('&');

let authURL = `${URL}?${QueryString}`;

let link = document.getElementById('oauth');
link.setAttribute('href', authURL);
