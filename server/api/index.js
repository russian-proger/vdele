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
    require('./get-user-projects')(core, api_router);
    require('./get-user')(core, api_router);

    
    core.GetApp().use('/api', api_router);
}