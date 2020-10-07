const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const keys = require('./client-google.json');

const oauth2Client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.rosters',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.profile.photos',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/drive.activity'
];

const authUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

console.log('Authorize this app by visiting this url:', authUrl);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oauth2Client.setCredentials(token);
    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log("r:"+tokens.refresh_token);
      }
      console.log(tokens.access_token);
    });
    
  });
});