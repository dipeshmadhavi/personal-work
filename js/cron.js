const cron = require("node-cron");

cron.schedule(
  "* * * * * *",
  () => {
    console.log("here run");
  },
  {
    scheduled: true,
    timezone: "America/New_York"
  }
);

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
