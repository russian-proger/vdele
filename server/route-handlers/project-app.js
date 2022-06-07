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
        const project = await core.GetModel('Project').findByPk(req.params.project_id); //getProject(req.params.project_id)
        const up = await core.GetModel('UserProject').findOne({
          where: {
            UserId: req.user_info.id,
            ProjectId: req.params.project_id
          }
        });

        if (!project) res.redirect('/');
        console.log(up);
        if (project.OrganizationId == null) {
          // User project
        //   const rights = await getUserProjectRights(req.user_info.id, req.params.project_id);
        //   req.user_info.rights = rights;
            req.user_info.rights = {right_id: (up != null ? up.right : 2)};
        } else {
          // Org project
        }
      
        let vars = ({
            user: JSON.stringify({...req.user_info, token: undefined, password: undefined }),
            project: JSON.stringify({...project.dataValues })
        });
      
        res.render('projapp', vars);
      });
}

module.exports = Main;