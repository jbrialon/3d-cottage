export default class StreamMode {
  constructor() {
    this.active = window.location.hash === "#stream";

    this.text = document.querySelectorAll(".js-text");
    if (this.active) {
      console.log("startLive");
    }
  }
}
