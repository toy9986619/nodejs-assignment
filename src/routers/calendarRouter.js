const express = require("express");
const { google } = require("googleapis");
const asyncHandler = require("../utils/asyncRouterHandler");

const router = express.Router();

const calendar = google.calendar({ version: "v3" });

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime"
      },
      (err, response) => {
        if (err) return console.log("The API returned an error: " + err);
        const events = response.data.items;
        if (events.length) {
          console.log("Upcoming 10 events:");
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);

            // console.log(`${i} - ${JSON.stringify(event)}`);
          });

          // fs.writeFile('calander_json.json', JSON.stringify(events, null, 2), 'utf8', (err) => {
          //   if(err) console.log(err)
          // });
          res.status(200).send({ message: "ok", events: events });
        } else {
          console.log("No upcoming events found.");
        }
      }
    );
  })
);

router.get(
  "/event/:eventId",
  asyncHandler(async (req, res, next) => {
    calendar.events.get(
      {
        calendarId: "primary",
        eventId: req.params.eventId
      },
      (err, response) => {
        if (err) return console.log("The API returned an error: " + err);
        const data = response.data;

        res.status(200).send({ message: "ok", event: data });
      }
    );
  })
);

router.patch(
  "/event/:eventId",
  asyncHandler(async (req, res, next) => {
    calendar.events.patch(
      {
        calendarId: "primary",
        eventId: req.params.eventId,
        resource: req.body.event
      },
      (err, response) => {
        if (err) return console.log("The API returned an error: " + err);

        res.status(200).send({ message: "ok", event: response.data });
      }
    );
  })
);

router.post(
  "/event",
  asyncHandler(async (req, res, next) => {
    calendar.events.post(
      {
        calendarId: "primary",
        resource: req.body.event
      },
      (err, response) => {
        if (err) return console.log("The API returned an error: " + err);

        res.status(200).send({ message: "ok", event: response.data });
      }
    )
  })
);

module.exports = router;
