const OpenTok = require('opentok');
var opentok = new OpenTok(
  '46981594',
  '29380b275abe032026b0604129a00721f4f3015e'
);

// var sessionId;

// opentok.createSession(function (error, session) {
//   if (error) {
//     console.log('Error creating session:', error);
//   } else {
//     sessionId = session.sessionId;
//     console.log('Session ID: ' + sessionId);
//   }
// });

var sessionId =
  '1_MX40Njk4MTU5NH5-MTYwNDk5NTE4NDIxNX44NU9PNy9NK2gvQ092ZGp2SGFCbFZTVDJ-UH4';

// Generate a token.
token = opentok.generateToken(sessionId);
console.log(token);
