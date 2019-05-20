const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const history = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// router require
const authRouter = require('./src/routers/authRouter');
const calendarRouter = require('./src/routers/calendarRouter');

const PORT = 9999;
const ENV_FILE = path.join(__dirname, '.env');

const app = express();

dotenv.config({ path: ENV_FILE });

// express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'testing secret',
    resave: false,
    saveUninitialized: false
}));

// webpack hot reload
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));


// app.use('/js', express.static(path.join(__dirname, 'public/js')));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));

// router define
app.use('/api/auth', authRouter);
app.use('/api/calendar', calendarRouter);

// spa history mode
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Example app listen on port ${PORT}!`));