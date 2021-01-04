const gplay = require("aso")("gplay");
const itunes = require("aso")("itunes");

// do stuff with google play
gplay.scores("rezility").then(console.log);

// do stuff with itunes
// itunes.scores("rezility").then(console.log);
