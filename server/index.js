const CookieParser = require('cookie-parser');
const Express = require('express');


async function Main() {
    const core = require("./core");
    const app = core.GetApp();
    
    // Settings
    app.set("view engine", "pug");
    app.set("views", `${__dirname}/../views`);
    
    app.use(Express.urlencoded({ extended: true }));
    app.use(CookieParser(core.GetConfig().server.secret_key));
    
    
    // Virual Folders
    {
        app.use('/css',                 Express.static(`${__dirname}/../source/css`));
        app.use('/dist',                Express.static(`${__dirname}/../dist`));
        app.use('/organization_photos', Express.static(`${__dirname}/../resources/organization_photos`));
        app.use('/profile_photos',      Express.static(`${__dirname}/../resources/profile_photos`));
        app.use('/scripts',             Express.static(`${__dirname}/../source/scripts`));
    }

    await (require("./database/index"))(core);
    require("./middlewares/auth")(core);
    require("./route-handlers/auth")(core);
    require("./route-handlers/main")(core);
    require("./route-handlers/network-app")(core);
    require("./route-handlers/project-app")(core);
    require("./api/index")(core);

    core.Listen();
}

Main();