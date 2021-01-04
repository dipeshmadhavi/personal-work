import { Component, Inject, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from "ionic-angular";
import Api from "../Api.js";
import { DOCUMENT } from "@angular/common";
import * as _ from "lodash";
import { Dictionary } from "lodash";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import {
  MediaCapture,
  CaptureVideoOptions,
  MediaFile,
} from "@ionic-native/media-capture";
import { Media, MediaObject } from "@ionic-native/media";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";

const MEDIA_FILES_KEY = "mediaFiles";

declare var EnxRtc;
@IonicPage()
@Component({
  selector: "page-room",
  templateUrl: "room.html",
})
export class RoomPage {
  @ViewChild("multi_video_container_div")
  local_video_div: any;
  multi_video_container_div: any;
  mediaFiles: any = [];
  SUPPORT_URL: "https://developer.enablex.io";
  loaded: false;
  localStream: any;
  room: any;
  roomID: string = "";
  userType: any;
  username: any;
  isVideoMuted: Boolean = false;
  isAudioMuted: Boolean = false;
  options: Dictionary<{
    attachMode: string;
    player: {
      autoplay: string;
      name: string;
      nameDisplayMode: string;
      frameFitMode: string;
      skin: string;
      class: string;
      aspectRatio: string;
      volume: number;
      media: string;
      height: string;
      width: string;
      loader: {
        show: Boolean;
        url: any;
        style: string;
        class: string;
      };
      backgroundImg: any;
    };
  }> = {
    options: {
      attachMode: "",
      player: {
        autoplay: "",
        name: "",
        nameDisplayMode: "",
        frameFitMode: "bestFit",
        skin: "classic",
        class: "player_mode",
        aspectRatio: "",
        volume: 0,
        media: "",
        height: "50vh",
        width: "48vw",
        loader: {
          show: false,
          url: "assets/img/video/loader.gif",
          style: "default",
          class: "",
        },
        backgroundImg: "assets/img/video/player-bg.gif",
      },
    },
  };
  toolbar: {
    displayMode: "auto";
    autoDisplayTimeout: 0;
    position: "top";
    skin: "default";
    iconset: "default";
    class: "";
    buttons: {
      play: false;
      share: false;
      mic: false;
      resize: false;
      volume: false;
      mute: false;
      record: false;
      playtime: false;
      zoom: false;
    };
    branding: {
      display: false;
      clickthru: "https://www.enablex.io";
      target: "new";
      logo: "assets/img/video/enablex.png";
      title: "EnableX";
      position: "right";
    };
  };

  config: Dictionary<{
    audio: Boolean;
    video: Boolean;
    data: Boolean;
    videoSize: any;
    attributes: {
      name: string;
    };
    options: any;
  }> = {
    config: {
      audio: true,
      video: true,
      data: true,
      videoSize: [320, 180, 640, 480],
      attributes: {
        name: "",
      },
      options: this.options.options,
    },
  };

  ATList: [any];
  countStream: 0;
  constructor(
    private file: File,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    private mediaCapture: MediaCapture,
    private media: Media,
    public alertController: AlertController,
    public navCtrl: NavController,
    @Inject(DOCUMENT) private document: Document,
    public navParams: NavParams,
    private camera: Camera
  ) {
    console.log("fsdf");
    let options = this.options.options;
    // this.config.options = options;
    console.log("options", this.config.config);
    this.roomID = this.navParams.get("roomId");
    this.userType = this.navParams.get("userType");
    this.username = this.navParams.get("userRef");
    console.log(this.username, this.roomID);
    if (!this.room) {
      this.createToken({
        name: this.username,
        role: this.userType,
        roomId: this.roomID,
        user_ref: this.username,
      });
    }
  }

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then((res) => {
      this.mediaFiles = JSON.parse(res) || [];
    });
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
    //   result => console.log('Has permission?', result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    // );

    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS])
    console.log("ionViewDidLoad RoomPage");
  }
  // captureAudio() {
  //   this.mediaCapture.captureAudio().then(res => {
  //     this.storeMediaFiles(res);
  //   })
  // }
  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 300,
    };
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      // this.storeMediaFiles(res);
      let capturedFile = res[0];
      console.log("my File : ", capturedFile);
      let filename = capturedFile.name;
      let dir = capturedFile["localURL"].split("/");
      dir.pop();
      let fromDirectory = dir.join("/");
      let toDirectory = this.file.dataDirectory;
      this.file
        .copyFile(fromDirectory, filename, toDirectory, filename)
        .then((res) => {
          // let url = res.nativeURL.replace(/^file:\/\//, '');
          this.storeMediaFiles([{ name: filename, size: capturedFile.size }]);
        });
    });
  }

  playFile(myfile) {
    if (myfile.name.indexOf(".wav")) {
      const audioFile: MediaObject = this.media.create(myfile.localURL);
      audioFile.play();
    } else {
      let path = this.file.dataDirectory + myfile.name;
      let url = path.replace(/^file:\/\//, "");
      let video = this.multi_video_container_div.nativeElement;
      video.src = url;
      video.play();
    }
  }

  storeMediaFiles(files) {
    console.log("stored file", files);
    this.storage.get(MEDIA_FILES_KEY).then((res) => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files));
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    });
  }
  videonew() {
    // console.log("sjdsgj", this.videoCapturePlus);
    this.presentAlert();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      title: "local video div : " + this.multi_video_container_div,
      message: "local stream : " + MEDIA_FILES_KEY,
      buttons: ["OK"],
    });

    await alert.present();
  }

  joinRoom(token) {
    // const this = this;
    EnxRtc.Logger.setLogLevel(4);

    let reconnectInfo = {
      allow_reconnect: false,
      number_of_attempts: 3,
      timeout_interval: 45000,
    };

    this.localStream = EnxRtc.joinRoom(
      token,
      this.config.config,
      function (success, error) {
        if (error) {
        }
        if (success && success != null) {
          this.room = success.room;

          let ownId = success.publishId;
          this.setLiveStream(this.localStream);

          for (let i = 0; i < success.streams.length; i++) {
            this.room.subscribe(success.streams[i]);
          }

          // Active Talker list is updated
          this.room.addEventListener("active-talkers-updated", function (
            event
          ) {
            this.ATList = event.message.activeList;
            let video_player_len = this.document.querySelector(
              "#multi_video_container_div"
            ).childNodes;
            if (
              event.message &&
              event.message !== null &&
              event.message.activeList &&
              event.message.activeList !== null
            ) {
              if (this.ATList.length == video_player_len.length) {
                return;
              } else {
                this.document.querySelector(
                  "#multi_video_container_div"
                ).innerHTML = "";

                for (let stream in this.room.remoteStreams.getAll()) {
                  let st = this.room.remoteStreams.getAll()[stream];
                  for (let j = 0; j < this.ATList.length; j++) {
                    if (this.ATList[j].streamId == st.getID()) {
                      this.setLiveStream(st, this.ATList[j].name);
                    }
                  }
                }
              }
            }
            console.log("Active Talker List :- " + JSON.stringify(event));
          });

          // Stream has been subscribed successfully
          this.room.addEventListener("stream-subscribed", function (
            streamEvent
          ) {
            let stream =
              streamEvent.data && streamEvent.data.stream
                ? streamEvent.data.stream
                : streamEvent.stream;
            for (let k = 0; k < this.ATList.length; k++) {
              if (this.ATList[k].streamId == stream.getID()) {
                this.setLiveStream(stream, this.ATList[k].name);
              }
            }
          });

          // Listening to Incoming Data
          this.room.addEventListener("active-talker-data-in", function (data) {
            console.log("active-talker-data-in" + data);
            let obj = {
              msg: data.message.message,
              timestamp: data.message.timestamp,
              username: data.message.from,
            };
            this.multi_video_container_div = {
              msg: data.message.message,
              timestamp: data.message.timestamp,
              username: data.message.from,
            };
            // Handle UI to display message
          });

          // Stream went out of Room
          this.room.addEventListener("stream-removed", function (event) {
            console.log(event);
          });

          this.room.addEventListener("room-disconnected", function (event) {
            window.location.href = this.SUPPORT_URL;
          });
        }
      },
      reconnectInfo // reconnect flag set to false
    );
  }

  createToken(data) {
    Api.post("/createToken", data)
      .then((response) => {
        console.log(response, "response");
        if (response.data.result === 0) {
          this.joinRoom(response.data.token);
        } else {
          console.log({
            group: "error",
            type: "error",
            text: response.data.error,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log({
          group: "error",
          type: "error",
        });
      });
  }

  setLiveStream(stream, userName) {
    stream.addEventListener("stream-data", function (e) {
      let text = e.msg.textMessage;
      let html = this.document
        .querySelector("#multi_text_container_div")
        .html();
      this.document
        .querySelector("#multi_text_container_div")
        .html(html + text + "<br>");
    });

    if (!stream.local) {
      let newStreamDiv = this.document.createElement("div");
      newStreamDiv.setAttribute("id", "liveStream_" + this.countStream);
      newStreamDiv.setAttribute("class", "live_stream_div");
      this.document
        .getElementById("multi_video_container_div")
        .appendChild(newStreamDiv);
      stream.show("liveStream_" + this.countStream, this.options);
      let node = this.document.createElement("div");
      if (userName !== "") {
        node.innerHTML = userName;
        node.classList.add("name-div");
        newStreamDiv.appendChild(node);
      }

      this.countStream++;
    } else {
      this.options.options.player.loader.class = "";
      this.options.options.player.loader.show = false;
      stream.show("local_video_div", this.options);
      let node = this.document.createElement("div");
      node.innerHTML = this.username;
      node.classList.add("name-div");
      this.document.getElementById("local_video_div").appendChild(node);
    }
  }

  audioToggle() {
    if (this.isAudioMuted) {
      this.localStream.unmuteAudio(function (arg) {
        this.isAudioMuted = false;
      });
    } else {
      this.localStream.muteAudio(function (arg) {
        this.isAudioMuted = true;
      });
    }
  }

  // videoToggle() {
  //   if (this.isVideoMuted) {
  //     this.localStream.unmuteVideo(function(res) {
  //       var streamId = this.localStream.getID();
  //       var player = document.getElementById("stream" + streamId);
  //       player.srcObject = this.localStream.stream;
  //       player.play();
  //       this.isVideoMuted = false;
  //     });
  //   } else {
  //     this.localStream.muteVideo(function(res) {
  //       this.isVideoMuted = true;
  //     });
  //   }
  // }

  endCall() {
    var r = confirm("You want to quit?");
    if (r == true) {
      this.room.disconnect();
    }
  }
}
