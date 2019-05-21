const express = require("express");
const { google } = require("googleapis");
const asyncHandler = require("../utils/asyncRouterHandler");

const router = express.Router();

const calendar = google.calendar({ version: "v3" });

router.get(
  "/",
  (req, res) => {
    const params = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      singleEvents: true,
      maxResults: 20,
      orderBy: "startTime"
    }

    calendar.events.list(
      params,
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return res.status(400).send({ message: err });
        }

        const events = response.data.items;
        if (events.length) {
          console.log("Upcoming 10 events:");
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });

          res.status(200).send({ message: "ok", events: events});
        } else {
          console.log("No upcoming events found.");
          res.status(200).send({ message: "ok", events: []});
        }
      }
    );
  });

router.get(
  "/event/:eventId",
  (req, res) => {
    calendar.events.get(
      {
        calendarId: "primary",
        eventId: req.params.eventId
      },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return res.status(400).send({ message: err });
        }
        const data = response.data;

        res.status(200).send({ message: "ok", event: data });
      }
    );
  });

router.put(
  "/event/:eventId",
  (req, res) => {
    calendar.events.update(
      {
        calendarId: "primary",
        eventId: req.params.eventId,
        resource: req.body.event
      },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err)
          return res.status(400).send({ message: err });
        };

        console.log(`eventID: ${req.params.eventId} update.`);
        res.status(200).send({ message: "ok", event: response.data });
      }
    );
  });

router.post(
  "/event",
  (req, res) => {
    calendar.events.insert(
      {
        calendarId: "primary",
        resource: req.body.event
      },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return res.status(400).send({ message: err });
        };

        console.log("event insert.");
        console.log(response.data);
        res.status(200).send({ message: "ok", event: response.data });
      }
    )
  });

router.get("/event/sync", asyncHandler(async (req, res, next) => {
  let syncToken = req.params.syncToken || "";
  console.log(syncToken);

  if (syncToken === "")
    syncToken = await fullSync();

  calendar.events.list({
    calendarId: "primary",
    syncToken: syncToken
  }, (err, response) => {
    if (err) {
      console.log("The API returned an error: " + err);
      return res.status(400).send({ message: err });
    }

    console.log("event sync.");
    console.log(response.data);
    res.status(200).send({ message: "ok", event: response.data.items, syncToken: response.data.nextSyncToken });
  })
}));

async function fullSync() {
  return new Promise((resolve, reject) => {
    calendar.events.list({ calendarId: "primary" }, (err, response) => {
      if (err) {
        console.log("The API returned an error: " + err);
        reject(err);
      }

      console.log(response.data.nextSyncToken);
      resolve(response.data.nextSyncToken);
    });
  });
}


module.exports = router;
