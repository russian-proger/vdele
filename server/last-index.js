// --------------= Import =----------------//

// Standart libraries
const crypto         = require('crypto');
const fs             = require('fs');
const http           = require('http');

// External libraries
const cookieParser   = require('cookie-parser');
const express        = require('express');
const mysql          = require('mysql2');
const orm            = require('sequelize');

// My .js files
const iniParser      = require('./ini-parser');
const expressions    = require('./utils/expressions');
const image_tool     = require('./utils/image');
require('./specifications/api-types');
require('./specifications/types');


// Variables
const ENV = iniParser.parseINIFile(__dirname + '/env.ini');

const app = express();
const server = http.createServer(app);

const mysqlOptions = ({
  username:     ENV.DATABASE.USER,
  password: ENV.DATABASE.PASSWORD,
  host:     ENV.DATABASE.HOST,
  port:     ENV.DATABASE.PORT,
  database: ENV.DATABASE.SCHEMA
});

const sequelize = new orm.Sequelize(ENV.DATABASE.SCHEMA, ENV.DATABASE.USER, ENV.DATABASE.PASSWORD, {
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log("Успешное подключение к MySQL");
}).catch(() => {
  console.error("Ошибка при подключении к MySQL");
  process.exit();
})

const pool = mysql.createPool(mysqlOptions);
const poolPromise = pool.promise();


// --------------= Functions =----------------//

/**
 * format from js date object into mysql datetime
 * @param {Date} date 
 * @returns {string}
 */
 function convertDate2DateTime(date) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function sendView(response, view_name) {
  response.send(fs.readFileSync(`${__dirname}/../views/${view_name}`).toString());
}

/**
 * Find user in MySQL table by mail
 * @param {string} mail
 * @returns {object|undefined}
 */
function getUserByMail(mail) {
  return new Promise(resolve => {
    pool.execute('SELECT * FROM `user` WHERE mail=?', [mail], function(err, result) {
      if (err) {
        console.error(err.message);
        resolve(1);
      }
      resolve(result[0]);
    });
  })
}

/**
 * Find user in MySQL table by nickname
 * @param {string} nick
 * @returns {object|undefined}
 */
function getUserByNick(nick) {
  return new Promise(resolve => {
    pool.execute('SELECT * FROM `user` WHERE nick=?', [nick], function(err, result) {
      if (err) {
        console.error(err.message);
        resolve(1);
      }
      resolve(result[0]);
    });
  })
}

async function getUserByID(user_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT id, nick, mail, first_name, last_name, photo_name, created_dt FROM user WHERE id=?`, [user_id]
  );
  return rows[0];
}

/**
 * Find user in MySQL table by vk_id
 * @TODO
 * @param {string} vkid
 * @returns {object|undefined}
 */
function getUserByVKID(vkid) {
  return undefined;
}

/**
 * 
 * @param {SignUpFormData} data 
 * @returns {bool}
 */
function addNewUser(data) {
  return new Promise((resolve) => {
    pool.execute(
    'INSERT INTO user (nick, first_name, last_name, mail, password, photo_name, created_dt) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
    [data.nick, data.first_name, data.last_name, data.mail, data.password, `${data.nick}.png`],
    async function(err, result) {
      if (err) {
        console.error(err.message);
        resolve(false);
      }
      await image_tool.generateRandomImage(`${__dirname}/../resources/profile_photos/${data.nick}.png`);
      resolve(true);
    });
  });
}

async function deleteSignToken(user_id, token) {
  const [rows, fields] = await poolPromise.execute(
    'DELETE FROM sign_token WHERE token=? AND user_id=?'
    , [token, user_id]
  );
}

async function createOrganization(user_id, name, logo_name, privacy_id) {
  const [rows, fields] = await poolPromise.execute(
    'CALL CreateOrganization(?, ?, ?, ?);'
    , [user_id, name, 1 - privacy_id, logo_name]
  );
}

async function createOrganizationProject(user_id, org_id, name, privacy_id) {
  await poolPromise.execute(
    'CALL CreateOrganizationProject(?, ?, ?, ?)', [user_id, org_id, name, 1 - privacy_id]
  );
}

async function createUserProject(user_id, name, privacy_id) {
  const [rows, fields] = await poolPromise.execute(
    `CALL CreateUserProject(?, ?, ?)`,
    [user_id, name, 1 - privacy_id]
  );
}


async function createProjectWorkspace(proj_id, name) {
  const [rows, fields] = await poolPromise.execute(
    `INSERT INTO workspace (name, project_id) VALUES (?, ?)`,
    [name, proj_id]
  );
}


async function createTask(ws_id, name, descr) {
  const [rows, fields] = await poolPromise.execute(
    `INSERT INTO task (workspace_id, name, description, created_dt, state_id) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)`,
    [ws_id, name, descr]
  );
}

async function getTask(task_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM task WHERE id=?`,
    [task_id]
  );
  return rows[0];
}

async function deleteProjectWorkspace(ws_id) {
  const [rows, fields] = await poolPromise.execute(
    `CALL DeleteProjectWorkspace(?)`,
    [ws_id]
  );
}

async function createProject(user_id, name, privacy_id) {
  const [rows, fields] = await poolPromise.execute(
    'CALL CreateProject(?, ?, ?, ?);'
    , [user_id, name, 1 - privacy_id, logo_name]
  );
}

async function addNewSignToken(user_id, token, end_date) {
  const [rows, fields] = await poolPromise.execute(
    'INSERT INTO sign_token (token, user_id, end_dt) VALUES (?, ?, ?)'
    , [token, user_id, convertDate2DateTime(end_date)]
  );
}

async function getUserBySignToken(user_id, token) {
  const [rows, fields] = await poolPromise.execute(
    'SELECT * FROM sign_token INNER JOIN user ON user.id=sign_token.user_id WHERE token=? AND user_id=?',
    [token, user_id]
  );
  return rows[0];
}

async function getUserOrganizations(user_id, onlyPublic=true) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM user_organizations WHERE user_id=? ${onlyPublic ? 'AND public=1' : ''}`,
    [user_id]
  );
  return rows;
}

async function getOrganization(org_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM organization WHERE id=?`,
    [org_id]
  );
  return rows[0];
}

async function getUserOrgRights(user_id, org_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM organization_member WHERE user_id=? AND org_id=?`,
    [user_id, org_id]
  );
  return rows[0];
}

async function getProject(project_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM project WHERE id=?`,
    [project_id]
  );
  return rows[0];
}

async function getUserProjectRights(user_id, project_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM project_member WHERE user_id=? AND project_id=?`,
    [user_id, project_id]
  );

  return rows[0];
}

async function getUserProjects(user_id, onlyPublic=true) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM user_projects WHERE user_id=? ${onlyPublic ? 'AND public=1' : ''}`,
    [user_id]
  );
  return rows;
}

async function getOrganizationProjects(user_id, org_id, onlyPublic=true) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM project LEFT JOIN project_member AS pm ON pm.project_id=project.id WHERE org_id=? AND (pm.user_id IS NULL OR pm.user_id=?) ${onlyPublic ? 'AND public=1' : ''}`,
    [org_id, user_id]
  );
  return rows;
}

async function getOrganizationParticipants(org_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM organization_member AS om LEFT JOIN user ON om.user_id=user.id WHERE om.org_id=?`,
    [org_id]
  );
  return rows;
}

async function getProjectParticipants(proj_id) {
  const [rows, fields] = await poolPromise.execute(
    `SELECT * FROM project_member AS pm LEFT JOIN user ON pm.user_id=user.id WHERE pm.project_id=?`,
    [proj_id]
  );
  return rows;
}

async function getProjectWorkspaces(proj_id) {
  return (await poolPromise.execute(`SELECT * FROM workspace WHERE project_id=?`, [proj_id]))[0];
}

async function getProjectTasks(proj_id) {
  return (await poolPromise.execute(`SELECT * FROM workspace_task WHERE project_id=?`, [proj_id]))[0];
}

async function addUserToProject(user_id, proj_id) {
  await poolPromise.execute('INSERT INTO project_member (user_id, project_id, right_id) VALUES (?, ?, 2)', [user_id, proj_id]);
}

async function getProjectMember(user_id, proj_id) {
  return (await poolPromise.execute('SELECT * FROM project_member WHERE user_id=? AND project_id=?', [user_id, proj_id]))[0];
}

async function deleteUserFromProject(user_id, proj_id) {
  return (await poolPromise.execute('DELETE FROM project_member WHERE user_id=? AND project_id=?', [user_id, proj_id]))[0];
}

async function changeProjectName(proj_id, name) {
  await poolPromise.execute('UPDATE project SET name=? WHERE id=?', [name, proj_id]);
}

function isValidMail(mail) {
  if (mail.length > 64) return false;
  return expressions.mail_expr.test(mail);
}

/**
 * Checks if form data is valid
 * @param {SignUpFormData} form
 * @returns 
 */
async function isValidSignUpForm(form) {
  if (
    !form.nick        ||
    !form.first_name  ||
    !form.last_name   ||
    !form.mail        ||
    !form.password    ||
    !form.repeat_password
  ) { return false; }
  if (form.password != form.repeat_password) {
    return false;
  }

  if (
    !expressions.uname_expr.test(form.first_name) ||
    !expressions.uname_expr.test(form.last_name)  ||
    !expressions.nick_expr .test(form.nick)       ||
    !expressions.pass_expr .test(form.password)
  ) { return false; }

  if (!isValidMail(form.mail)) {
    return false;
  }

  if (
    await getUserByMail(form.mail) !== undefined ||
    await getUserByNick(form.nick) !== undefined
  ) { return false; }

  return true;
}

/**
 * Find the user by cookie data
 * @param {Object} cookies 
 * @returns {UserTable|null}
 */
async function getUserByCookie(cookies) {
  if (!cookies || !cookies.user_id || !cookies.sign_token) {
    return undefined;
  }

  if (
    !expressions.int_expr.test(cookies.user_id) ||
    !expressions.token_expr.test(cookies.sign_token)
  ) { return undefined; }

  return await getUserBySignToken(cookies.user_id, cookies.sign_token);
}

function checkNetworkApp(req, res) {
  if (req.is_auth) {
    return res.render('netapp', {user: JSON.stringify({...req.user_info, token: undefined, password: undefined }) });
  } else {
    return res.redirect('/');
  }
}




// --------------= Middlewares =----------------//

app.use(cookieParser(ENV.SERVER.SECRET_KEY));

// User auth middleware
app.use('/', async (req, res, next) => {
  const uinfo = await getUserByCookie(req.cookies);
  req.is_auth = !!uinfo;
  
  if (req.is_auth) {
    req.user_info = uinfo;
  } else {
    res.clearCookie('sign_token');
    res.clearCookie('user_id');
  }

  return next();
});

// Settings
app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);



// --------------= Routes =----------------//


app.use(express.urlencoded({ extended: true }));

// Direct routes
{
  app.get('/', (req, res) => {
    if (req.is_auth) {
      return res.render('netapp', {user: JSON.stringify({...req.user_info, token: undefined, password: undefined }) });
    }
    sendView(res, 'welcome.html');
  });

  app.get('/favicon.ico', (req, res) => {
    return res.sendFile(`${__dirname}/favicon.png`);
  });

  app.get('/login', (req, res) => {
    if (req.is_auth) return res.redirect('/');
    res.render('login', {});
  });
  
  app.post('/login', async (req, res) => {
    if (req.is_auth) return res.redirect('/');
    /** @type {SignInFormData} */
    const data = req.body;
    if (data && data.login && data.password) {
      let uinfo;
      if (expressions.mail_expr.test(data.login)) {
        // login is a mail
        uinfo = await getUserByMail(data.login);
      } else if (expressions.nick_expr.test(data.login)) {
        // login is a nickname
        uinfo = await getUserByNick(data.login);
      } else {
        return res.render('login', { incorrect_login: true });
      }
  
      if (uinfo === undefined) {
        return res.render('login', { incorrect_login: true });
      } else if (uinfo.password != data.password) {
        return res.render('login', { incorrect_password: true });
      }
  
      const key = crypto.generateKeySync('hmac', { length: 256 }).export().toString("hex");
      const token = `${uinfo.id}_${key}`;
      let cookieOptions = new Object();
  
      if (data.remember || true) {
        cookieOptions.expires = new Date(Date.now() + 28*24*60*60*1000);
        addNewSignToken(uinfo.id, token, cookieOptions.expires);
      } else {
        addNewSignToken(uinfo.id, token, new Date(Date.now() + 24*60*60*1000));
      }
  
      res.cookie('sign_token', token, cookieOptions);
      res.cookie('user_id', uinfo.id, cookieOptions);
      return res.redirect("/");
    }
  
    return res.render('login', {});
  });
  
  app.get('/signup', (req, res) => {
    if (req.is_auth) return res.redirect('/');
    res.render('signup', {});
  });
  
  app.post('/signup', async (req, res) => {
    if (req.is_auth) return res.redirect('/');
    if (req.body && await isValidSignUpForm(req.body)) {
      await addNewUser(req.body);
  
      return res.redirect('/login');
    } else {
      res.render('signup', {...req.body});
    }
    res.end();
    return;
  });
  
  app.get('/auth_vk', (req, res) => {
    sendView(res, 'auth_vk.html');
  });
  
  app.all('/quit', async (req, res) => {
    if (req.is_auth) await deleteSignToken(req.user_info.id, req.user_info.token);
    return res.redirect('/');
  });
}


// Network App
{
  const networkAppHandle = (req, res) => checkNetworkApp(req, res);
  app.use('/profile/:user_id', networkAppHandle);
  app.use('/new_organization', networkAppHandle);
  app.use('/new_organization_project', networkAppHandle);
  app.use('/new_project', networkAppHandle);
  app.use('/organization/:org_id', networkAppHandle);
}

// Project App
app.all('/project/:project_id/', async (req, res) => {
  if (!req.is_auth) {
    /** @ignore */
    return res.redirect('/login');
  }
  
  if (!expressions.int_expr.test(req.params.project_id)) return res.redirect('/');
  const project = await getProject(req.params.project_id)
  if (!project) res.redirect('/');

  if (project.org_id == null) {
    // User project
    const rights = await getUserProjectRights(req.user_info.id, req.params.project_id);
    req.user_info.rights = rights;
    
  } else {
    // Org project
  }

  let vars = ({
    user: JSON.stringify({...req.user_info, token: undefined, password: undefined }),
    project: JSON.stringify({...project })
  });

  res.render('projapp', vars);
});


// Virual Folders
{
  app.use('/scripts', express.static(`${__dirname}/../source/scripts`));
  app.use('/css', express.static(`${__dirname}/../source/css`));
  app.use('/dist', express.static(`${__dirname}/../dist`));
  app.use('/profile_photos', express.static(`${__dirname}/../resources/profile_photos`));
  app.use('/organization_photos', express.static(`${__dirname}/../resources/organization_photos`));
}



// --------------= API Route =----------------//
{
  const apiRoute = express.Router();
  apiRoute.use(express.json());
  // Auth-filter middleware
  apiRoute.use('/', (req, res, next) => {
    if (!req.is_auth) {
      res.sendStatus(401);
      return res.end();
    }
    next();
  });
  
  apiRoute.post('/get_user', async (req, res) => {
    /** @type {GetUserRequest} */
    const body = req.body;
    if (!body.user_id || !expressions.int_expr.test(body.user_id)) return res.sendStatus(400);
  
    const uinfo = await getUserByID(body.user_id);
    return res.send(JSON.stringify({data: uinfo}));
  });
  
  apiRoute.post('/get_user_projects', async (req, res) => {
    if (!req.body.user_id || !expressions.int_expr.test(req.body.user_id)) return res.sendStatus(400);
    const rows = await getUserProjects(req.user_info.id, req.user_info.id != req.body.user_id);
    return res.send(JSON.stringify({result: true, data: rows}));
  });
  
  apiRoute.post('/get_user_organizations', async (req, res) => {
    if (!req.body.user_id || !expressions.int_expr.test(req.body.user_id)) return res.sendStatus(400);
    const rows = await getUserOrganizations(req.user_info.id, req.user_info.id != req.body.user_id);
    return res.send(JSON.stringify({result: true, data: rows}));
  });
  
  apiRoute.post('/get_organization', async (req, res) => {
    if (!req.body.org_id || !expressions.int_expr.test(req.body.org_id)) return res.sendStatus(400);
    const organization = await getOrganization(req.body.org_id);
    if (!organization) return res.send(JSON.stringify({result: true, data: undefined}));
    
    const member = await getUserOrgRights(req.user_info.id, req.body.org_id);
    if (organization.public) {
      return res.send(JSON.stringify({result: true, data: organization, rights: member}));
    }
  
    if (member != undefined) {
      return res.send(JSON.stringify({result: true, data: organization, rights: member}));
    } else {
      return res.send(JSON.stringify({result: true, data: null, rights: member}));
    }
  });
  
  apiRoute.post('/get_organization_projects', async (req, res) => {
    if (!req.body.org_id || !expressions.int_expr.test(req.body.org_id)) return res.sendStatus(400);
    const member = await getUserOrgRights(req.user_info.id, req.body.org_id);
    const organization = await getOrganization(req.body.org_id);
    if (!organization) return res.send(JSON.stringify({result: false, reason: 1}));
    if (!organization.public && !member) return res.send(JSON.stringify({result: false, reason: 2}));
  
    const onlyPublic = !member || member.right_id == 2;
    const projects = await getOrganizationProjects(req.user_info.id, req.body.org_id, onlyPublic);
    return res.send(JSON.stringify({result: true, data: projects}));
  });
  
  apiRoute.post('/get_organization_participants', async (req, res) => {
    if (!req.body.org_id || !expressions.int_expr.test(req.body.org_id)) return res.sendStatus(400);
    const participants = await getOrganizationParticipants(req.body.org_id);
    return res.send(JSON.stringify({result: true, data: participants}));
  });
  
  apiRoute.post('/get_project_participants', async (req, res) => {
    if (!req.body.proj_id || !expressions.int_expr.test(req.body.proj_id)) return res.sendStatus(400);
    const participants = await getProjectParticipants(req.body.proj_id);
    return res.send(JSON.stringify({result: true, data: participants}));
  });

  apiRoute.post('/get_project_workspaces', async (req, res) => {
    const body = req.body;
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);
    const workspaces = await getProjectWorkspaces(body.proj_id);
    return res.send(JSON.stringify({result: 1, data: workspaces}));
  });

  apiRoute.post('/get_project_tasks', async (req, res) => {
    const body = req.body;
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);
    const tasks = await getProjectTasks(body.proj_id);
    return res.send(JSON.stringify({result: 1, data: tasks}));
  });
  
  apiRoute.post('/new_organization_project', async (req, res) => {
    const body = req.body;
    if (!body.org_id || !expressions.int_expr.test(body.org_id)) return res.send(JSON.stringify({result: false, reason: 1}));
    if (!body.name || !expressions.orgname_expr.test(body.name)) return res.send(JSON.stringify({result: false, reason: 2}));
    if (!body.privacy || privacy_values.indexOf(body.privacy) == -1) return res.send(JSON.stringify({result: false, reason: 3}));
  
    await createOrganizationProject(req.user_info.id, body.org_id, body.name, privacy_values.indexOf(body.privacy));
    return res.send(JSON.stringify({result: true}));
  })
  
  const privacy_values = ['public', 'private'];
  apiRoute.post('/new_organization', async (req, res) => {
    const body = req.body;
    if (!body.name || !expressions.orgname_expr.test(body.name)) return res.sendStatus(400);
    if (privacy_values.indexOf(body.privacy) == -1) return res.sendStatus(400);
  
    const logo_name = `${body.name}_${Date.now()}.png`;
    await createOrganization(req.user_info.id, body.name, logo_name, privacy_values.indexOf(body.privacy));
    await image_tool.generateRandomImage(`${__dirname}/../resources/organization_photos/${logo_name}`, 1)
    return res.send(JSON.stringify({result: true}));
  });
  
  apiRoute.post('/new_project_workspace', async (req, res) => {
    const body = req.body;
    if (!body.name || !expressions.orgname_expr.test(body.name)) return res.sendStatus(400);
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);

    await createProjectWorkspace(body.proj_id, body.name);
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/new_task', async (req, res) => {
    const body = req.body;
    if (!body.ws_id || !expressions.int_expr.test(body.ws_id)) return res.sendStatus(400);
    if (!body.name || !expressions.taskname_expr.test(body.name)) return res.sendStatus(400);
    if (!body.descr || !expressions.taskdescr_expr.test(body.descr)) return res.sendStatus(400);

    await createTask(body.ws_id, body.name, body.descr);
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/get_task', async (req, res) => {
    const body = req.body;
    if (!body.task_id || !expressions.int_expr.test(body.task_id)) return res.sendStatus(400);

    const task = await getTask(body.task_id);
    return res.send(JSON.stringify({result: true, data: task}));
  });
  
  apiRoute.post('/rem_project_workspace', async (req, res) => {
    const body = req.body;
    if (!body.ws_id || !expressions.int_expr.test(body.ws_id)) return res.sendStatus(400);

    await deleteProjectWorkspace(body.ws_id);
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/new_user_project', async (req, res) => {
    const body = req.body;
    if (!body.name || !expressions.orgname_expr.test(body.name)) return res.sendStatus(400);
    if (!body.privacy || privacy_values.indexOf(body.privacy) == -1) return res.sendStatus(400);
  
    await createUserProject(req.user_info.id, body.name, privacy_values.indexOf(body.privacy));
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/add_participant_to_project', async (req, res) => {
    const body = req.body;
    if (!body.nick || !expressions.nick_expr.test(body.nick)) return res.sendStatus(400);
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);

    const user = await getUserByNick(body.nick);
    if (!user) return res.send(JSON.stringify({result: false, reasonCode: 0}));

    const member = await getProjectMember(user.id, body.proj_id);
    if (member.length != 0) return res.send(JSON.stringify({result: false, reasonCode: 1}));
    await addUserToProject(user.id, body.proj_id);
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/rem_participant_from_project', async (req, res) => {
    const body = req.body;
    if (!body.user_id || !expressions.int_expr.test(body.user_id)) return res.sendStatus(400);
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);
    const member = getProjectMember(body.user_id, body.proj_id);
    if (member.length == 0) return res.send(JSON.stringify({result: false, reasonCode: 0}));
    await deleteUserFromProject(body.user_id, body.proj_id);
    return res.send(JSON.stringify({result: true}));
  });

  apiRoute.post('/change_project_name', async (req, res) => {
    const body = req.body;
    if (!body.proj_id || !expressions.int_expr.test(body.proj_id)) return res.sendStatus(400);
    if (!body.name || !expressions.projname_expr.test(body.name)) return res.sendStatus(400);

    await changeProjectName(body.proj_id, body.name);
    return res.send(JSON.stringify({result: true}));
  });
  
  app.use('/api', apiRoute);
}



// --------------= Start server =----------------//

// Start server
server.listen(ENV.SERVER.SERVER_PORT);