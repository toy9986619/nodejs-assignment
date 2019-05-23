const express = require("express");
const { google } = require("googleapis");
const asyncHandler = require("../utils/asyncRouterHandler");

const router = express.Router();
const calendar = google.calendar({ version: "v3" });

// events 列表
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

          res.status(200).send({ message: "ok", events: events });
        } else {
          console.log("No upcoming events found.");
          res.status(200).send({ message: "ok", events: [] });
        }
      }
    );
  }
);

// 利用 eventId 取得 event 詳細資訊
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
  }
);

// event 更新
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
  }
);

// 新增 event
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
  }
);

// 刪除 event
router.delete("/event/:eventId", (req, res) => {
  calendar.events.delete({
    calendarId: "primary",
    eventId: req.params.eventId
  }, (err, response) => {
    if (err) {
      console.log("The API returned an error: " + err);
      return res.status(400).send({ message: err });
    }

    console.log(`eventId ${req.params.eventId} deleted.`);
    res.status(204).send();
  })
});

// calendar sync
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

// calendar full sync method
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
