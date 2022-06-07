/**
 * @param {import('../core')} core 
 */
module.exports = async (core) => {
    const seq = core.GetSequelize();

/** Models */
    const AccessToken = require('./AccessToken')(core);
    const Organization = require('./Organization')(core);
    const Task = require('./Task')(core);
    const User = require('./User')(core);
    const Project = require('./Project')(core);
    const Workspace = require('./Workspace')(core);
    const UserProject = require('./UserProject')(core);
    const UserOrganization = require('./UserOrganization')(core);



/** Relations */
    // AccessToken -> User
    AccessToken.belongsTo(User);

    // Task -> Workspace
    Task.belongsTo(Workspace);
    
    // Workspace -> Project
    Workspace.belongsTo(Project);

    // Project -> Organization
    Project.belongsTo(Organization);

    
    // UserOrganization
    User.belongsToMany(Organization, { through: UserOrganization });
    Organization.belongsToMany(User, { through: UserOrganization });
    
    // UserProject
    User.belongsToMany(Project, { through: UserProject });
    Project.belongsToMany(User, { through: UserProject });

    Project.hasMany(UserProject);
    User.hasMany(UserProject);
    UserProject.belongsTo(User);
    UserProject.belongsTo(Project);


/** Uploading to core */
    core.SetModel('AccessToken',            AccessToken);
    core.SetModel('Organization',           Organization);
    core.SetModel('Task',                   Task);
    core.SetModel('User',                   User);
    core.SetModel('Project',                Project);
    core.SetModel('Workspace',              Workspace);
    core.SetModel('UserProject',            UserProject);
    core.SetModel('UserOrganization',       UserOrganization);


/** Sync */
    // seq.query("SET FOREIGN_KEY_CHECKS=0");
    await seq.sync({force: false});
}