function connect() {
  const TWILIO_ROOM = 'test'
  const TWILIO_TOKEN = '<YOUR_TOKEN>';

  // We load twilio-video after cordova-plugin-iosrtc
  // because twilio-video reference WebRTC globals and keep reference
  loadScript('https://media.twiliocdn.com/sdk/js/video/releases/2.4.0/twilio-video.js').then(function () {
      joinRoom({
          token: TWILIO_TOKEN,
          room: TWILIO_ROOM
      });
  });
}

var scriptUrls = [];
function loadScript(scriptUrl) {

  if (scriptUrls[scriptUrl]) {
      return Promise.resolve(scriptUrl);
  }

  return new Promise(function(resolve, reject) {
      // load adapter.js
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptUrl;
      script.async = false;
      document.getElementsByTagName("head")[0].appendChild(script);
      script.onload = function() {
          scriptUrls[scriptUrl] = true;
          console.debug('loadScript.loaded', script.src);
          resolve(scriptUrl);
      };
  });
}

function joinRoom(result) {

  const Video = Twilio.Video;
  Video.createLocalTracks().then(localTracks => {
      const localMediaContainer = document.getElementById('local-media');

      Array.from(localTracks.values()).forEach(function (track) {
          localMediaContainer.appendChild(track.attach());
      });

      return localTracks;
  }).then(function (localTracks) {

      Video.connect(result.token, {
          name: result.room,
          //sdpSemantics: 'plan-b',
          //bundlePolicy: 'max-compat',
          tracks: localTracks,
      }).then(room => {
          console.log(`Successfully joined a Room: ${room}`);

          // Attach the Tracks of the Room's Participants.
          var remoteMediaContainer = document.getElementById('remote-media');
              room.participants.forEach(function(participant) {
              console.log("Already in Room: '" + participant.identity + "'");
              participantConnected(participant, remoteMediaContainer);
          });

          room.on('participantConnected', participant => {
              console.log(`A remote Participant connected: ${participant}`);
              participantConnected(participant);
          });

          room.on('participantDisconnected', participant => {
              console.log(`A remote Participant connected: ${participant}`);
              participantDisconnected(participant);
          });

      }, error => {
          console.error(`Unable to connect to Room: ${error.message}`);
      });

      function participantConnected(participant) {
          console.log('Participant "%s" connected', participant.identity);
          const div = document.createElement('div');
          div.id = participant.sid;
          participant.on('trackSubscribed', (track) => {
              trackSubscribed(div, track)
          });
          participant.on('trackUnsubscribed', trackUnsubscribed);
          participant.tracks.forEach(publication => {
              if (publication.isSubscribed) {
                  trackSubscribed(div, publication.track);
              }
          });

          document.getElementById('remote-media').appendChild(div);
      }

      function participantDisconnected(participant) {
          console.log('Participant "%s" disconnected', participant.identity);

          var div = document.getElementById(participant.sid)
          if (div) {
              div.remove();
          }
      }

      function trackSubscribed(div, track) {
          div.appendChild(track.attach());
      }

      function trackUnsubscribed(track) {
          track.detach().forEach(element => element.remove());
      }
  });
}

// Detect if current enviroment is cordova
var isCordova = !document.URL.includes('http');

// Regular Browser, no cordova
if (!isCordova) {
  connect();

// Handle Cordova and enable cordova.plugins.iosrtc
} else {

  document.addEventListener('deviceready', function () {
      // Note: This allow this sample to run on any Browser
      if (cordova && cordova.plugins && cordova.plugins.iosrtc) {

          // Expose WebRTC and GetUserMedia SHIM as Globals (Optional)
          // Alternatively WebRTC API will be inside cordova.plugins.iosrtc namespace
          cordova.plugins.iosrtc.registerGlobals();

          // Enable iosrtc debug (Optional)
          cordova.plugins.iosrtc.debug.enable('*', true);
      }

      connect();
  }, false);
}