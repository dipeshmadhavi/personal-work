const OpenTok = require('opentok');

var apiKey = '46981594';
var sessionId =
  '1_MX40Njk4MTU5NH5-MTYwNDk5NTE4NDIxNX44NU9PNy9NK2gvQ092ZGp2SGFCbFZTVDJ-UH4';
var token =
  'T1==cGFydG5lcl9pZD00Njk4MTU5NCZzaWc9MjcyMjg1ZGRjZGI4ODBhYzgyNjc0MTY1NmI4OTlhNTZlNmVjNGU0ZDpzZXNzaW9uX2lkPTFfTVg0ME5qazRNVFU1Tkg1LU1UWXdORGs1TlRFNE5ESXhOWDQ0TlU5UE55OU5LMmd2UTA5MlpHcDJTR0ZDYkZaVFZESi1VSDQmY3JlYXRlX3RpbWU9MTYwNDk5NTIyNSZub25jZT0wLjIyODM5MTcxOTgwOTk3Mzg2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MDUwODE2MjUmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=';
var session = OT.initSession(apiKey, sessionId);
var publisher = OT.initPublisher();
session.connect(token, function (err) {
  session.publish(publisher);
  session.on('streamCreated', function (event) {
    session.subscribe(event.stream);
  });
});
