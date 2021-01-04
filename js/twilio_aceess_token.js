const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of tokens
const twilioAccountSid = 'ACf48c8afe960bba2d81a6d526d83b6696';
const twilioApiKey = 'SK9011bdfb0995dd12764e2a4485dd7ace';
const twilioApiSecret = 'ReAdyS5vlG3KMCRnM2XxV03WGuZF5tAH';

const identity = 'dipesh';

// Create Video Grant
const videoGrant = new VideoGrant({
  room: 'cool_room',
});

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret,
  {identity: identity}
);
token.addGrant(videoGrant);

// Serialize the token to a JWT string
console.log(token.toJwt());
