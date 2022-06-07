const Express = require('express');
/**
 * 
 * @param {import('../core')} core 
 */
module.exports = (core) => {
    const api_router = Express.Router();
    api_router.use(Express.json());

    // Auth-filter middleware
    require('./middleware-auth')(core, api_router);
    require('./get-user')(core, api_router);
    require('./get-user-projects')(core, api_router);
    require('./get-user-organizations')(core, api_router);
    require('./get-project-workspaces')(core, api_router);
    require('./get-project-tasks')(core, api_router);
    require('./remove-project')(core, api_router);
    require('./new-organization')(core, api_router);
    require('./remove-workspace')(core, api_router);
    require('./new-user-project')(core, api_router);
    require('./new-workspace')(core, api_router);
    require('./edit-project-name')(core, api_router);
    
    core.GetApp().use('/api', api_router);
}