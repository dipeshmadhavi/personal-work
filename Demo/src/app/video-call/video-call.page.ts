import { Component, OnInit } from '@angular/core';

const video = require('twilio-video');

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
})
export class VideoCallPage implements OnInit {
  private ActiveRoom;
  private roomName = 'cool_room';
  public isActive = false;
  public token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzkwMTFiZGZiMDk5NWRkMTI3NjRlMmE0NDg1ZGQ3YWNlLTE1OTgzMzYwMzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJ1c2VyIiwidmlkZW8iOnsicm9vbSI6ImNvb2wgcm9vbSJ9fSwiaWF0IjoxNTk4MzM2MDM5LCJleHAiOjE1OTgzMzk2MzksImlzcyI6IlNLOTAxMWJkZmIwOTk1ZGQxMjc2NGUyYTQ0ODVkZDdhY2UiLCJzdWIiOiJBQ2Y0OGM4YWZlOTYwYmJhMmQ4MWE2ZDUyNmQ4M2I2Njk2In0.D4wgdv9a8EUSRP7dhUfnJIAB3puZ42QzpxMfa5F7FlI';

  constructor() {}

  ngOnInit() {}

  setupMedia = () => {
    video
      // .createLocalTracks({
      //   audio: true,
      //   video: { width: 640 },
      // })
      // .then((localTracks) => {
      //   return connect(this.token, {
      //     name: this.roomName,
      //     tracks: localTracks,
      //   });
      // })
      // .then((room) => {
      //   console.log(`Connected to Room: ${room.name}`);
      // });

      .connect(this.token, {
        audio: true,
        name: this.roomName,
        video: { width: 640 },
      })
      .then((room) => {
        this.ActiveRoom = room;
        this.isActive = true;
        console.log(`Connected to Room: ${room.name}`);
      });
  };

  createdRoom() {
    video.connect(this.token, { name: this.roomName }).then(
      (room) => {
        console.log(`Successfully joined a Room: ${room}`);
        room.on('participantConnected', (participant) => {
          console.log(`A remote Participant connected: ${participant}`);
          room.participants.forEach(this.participantConnected);
          room.on('participantConnected', this.participantConnected);
        }),
          room.on('disconnected', (room) => {
            // Detach the local media elements
            room.localParticipant.tracks.forEach((publication) => {
              const attachedElements = publication.track.detach();
              attachedElements.forEach((element) => element.remove());
            });
          });
      },
      (error) => {
        console.error(`Unable to connect to Room: ${error.message}`);
      },
    );
  }

  participantConnected(participant) {
    participant.tracks.forEach(this.trackPublished);
    participant.on('trackPublished', this.trackPublished);
  }

  trackPublished(publication) {
    if (publication.isSubscribed) {
      this.trackSubscribed(publication.track);
    }
    publication.on('subscribed', this.trackSubscribed);
    publication.on('unsubscribed', this.trackUnsubscribed);
  }

  trackSubscribed(track) {
    document.getElementById('remote-media').appendChild(track.attach());
  }

  trackUnsubscribed(track) {
    track.detach().forEach((ele) => ele.remove());
  }

  disconnectCall = () => {
    if (this.isActive) {
      this.ActiveRoom.disconnect();
      this.isActive = false;
      console.log(`Disconnected to Room: ${this.ActiveRoom.name}`);
    }
  };
}
