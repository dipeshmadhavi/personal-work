const container = document.getElementById('video-container');
const button = document.getElementById('get-video');

button.addEventListener('click', () => {
  Twilio.Video.createLocalVideoTrack().then(track => {
    setTimeout(() => {
      container.classList.add('live');
    }, 2000);
    container.append(track.attach());
    const name = document.createElement("p");
    name.classList.add("name");
    name.append(document.createTextNode("Phil Nash"));
    container.append(name);
    button.remove();
  });
})