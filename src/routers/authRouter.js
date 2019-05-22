const express = require("express");
const { google } = require("googleapis");
const fetch = require("node-fetch");
const asyncHandler = require("../utils/asyncRouterHandler");
const credentials = require("../../credentials.json");
const { client_secret, client_id } = credentials.installed;
const REDIRECT_URL = "http://localhost:9999/api/auth/google_oauth_redirect";

const router = express.Router();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
];

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  REDIRECT_URL
);

router.get(
  "/login",
  asyncHandler(async (req, res, next) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });

    res.redirect(authUrl);
  })
);

router.get(
  "/google_oauth_redirect",
  asyncHandler(async (req, res, next) => {
    const code = req.query.code;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    google.options({ auth: oAuth2Client });

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });
    const data = await response.json();
    req.session.username = data.name;
    req.session.email = data.email;

    console.log("ok!");
    res.redirect("/");
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res, next) => {
    req.session.destroy();
    res.status(200).send({ message: "OK!" });
  })
);

router.get(
  "/check_login",
  asyncHandler(async (req, res, next) => {
    const username = req.session.username || null;
    res.status(200).send({ username: req.session.username });
  })
);

module.exports = router;
