const CookieParser = require('cookie-parser');
const Express = require('express');

const core = require("./core");

require("./route-handlers/auth")(core);
require("./route-handlers/main")(core);
require("./api/index")(core);

const app = core.GetApp();

// Settings
app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);

app.use(CookieParser(core.GetConfig().server.secret_key));


// Virual Folders
{
    app.use('/scripts',             Express.static(`${__dirname}/../source/scripts`));
    app.use('/css',                 Express.static(`${__dirname}/../source/css`));
    app.use('/dist',                Express.static(`${__dirname}/../dist`));
    app.use('/profile_photos',      Express.static(`${__dirname}/../resources/profile_photos`));
    app.use('/organization_photos', Express.static(`${__dirname}/../resources/organization_photos`));
}

core.Listen();