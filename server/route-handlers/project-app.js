const Express = require('express');
const utils = require('../utils');

/**
 * 
 * @param {import('../core')} core 
 */
function Main(core) {
    const app = core.GetApp();

    app.all('/project/:project_id/', async (req, res) => {
      if (!req.is_auth) {
        /** @ignore */
        return res.redirect('/login');
      }
      
      if (!utils.checker.IsInteger(req.params.project_id)) return res.redirect('/');
      const project = utils.database.GetData(await core.GetModel('Project').findByPk(req.params.project_id)); //getProject(req.params.project_id)
      const right = await utils.database.GetUserProjectRight(core, req.user_info.id, req.params.project_id);

      if (!project) res.redirect('/');
      if (!project.isPublic && right == 3) {
        return utils.express.SendView(res, '404.html');
      }
      req.user_info.rights = {right_id: right};

      let vars = ({
          user: JSON.stringify({...req.user_info, token: undefined, password: undefined }),
          project: JSON.stringify({...project })
      });
    
      res.render('projapp', vars);
    });
}

module.exports = Main;