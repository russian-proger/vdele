// --------------= Import =----------------//

// Standart libraries
const crypto         = require('crypto');
const fs             = require('fs');
const http           = require('http');

// External libraries
const cookieParser   = require('cookie-parser');
const express        = require('express');
const mysql          = require('mysql2');

// My .js files
const iniParser      = require('./ini-parser');
const expressions    = require('./expressions');
const image_tool     = require('./image');
require('./api_types');
require('./types');


// Variables
const ENV = iniParser.parseINIFile(__dirname + '/env.ini');

const app = express();
const server = http.createServer(app);

const mysqlOptions = ({
  user:     ENV.DATABASE.USER,
  password: ENV.DATABASE.PASSWORD,
  host:     ENV.DATABASE.HOST,
  port:     ENV.DATABASE.PORT,
  database: ENV.DATABASE.SCHEMA
});

{
  // Checking connection with MySQL
  const connection = mysql.createConnection(mysqlOptions);
  
  if (connection.connect((err) => {
    if (err) {
      return console.error("Ошибка при подключении к БД: " + err.message);
    } else {
      console.log("Подключение к БД успешно!");
    }
  }));
}

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

async function getOrganizations(user_id) {
  const [rows, fields] = await poolPromise.execute(
    'SELECT * FROM user_organizations WHERE user_id=?',
    [user_id]
  );
  return rows;
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

// Main route
app.get('/', (req, res) => {
  if (req.is_auth) {
    return res.render('netapp', {user: JSON.stringify({...req.user_info, token: undefined, password: undefined }) });
  }
  sendView(res, 'welcome.html');
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

    if (data.remember) {
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

const networkAppHandle = (req, res) => {
  return checkNetworkApp(req, res);
};
app.use('/profile/:user_id', networkAppHandle);
app.use('/new_organization', networkAppHandle);

app.all('/quit', async (req, res) => {
  if (req.is_auth) await deleteSignToken(req.user_info.id, req.user_info.token);
  return res.redirect('/');
});


// Folders
app.use('/scripts', express.static(`${__dirname}/../source/scripts`));
app.use('/css', express.static(`${__dirname}/../source/css`));
app.use('/dist', express.static(`${__dirname}/../dist`));
app.use('/profile_photos', express.static(`${__dirname}/../resources/profile_photos`));
app.use('/organization_photos', express.static(`${__dirname}/../resources/organization_photos`));



// --------------= API Route =----------------//
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

apiRoute.post('/get_projects', (req, res) => {

});

apiRoute.post('/get_organizations', async (req, res) => {
  const rows = await getOrganizations(req.user_info.id);
  return res.send(JSON.stringify({result: true, data: rows}));
});

const privacy_values = ['public', 'private'];
apiRoute.post('/new_organization', async (req, res) => {
  const body = req.body;
  if (!body.name || !expressions.orgname_expr.test(body.name)) return res.sendStatus(400);
  if (!body.privacy || privacy_values.indexOf(body.privacy) == -1) return res.sendStatus(400);

  const logo_name = `${body.name}_${Date.now()}.png`;
  await createOrganization(req.user_info.id, body.name, logo_name, privacy_values.indexOf(body.privacy));
  await image_tool.generateRandomImage(`${__dirname}/../resources/organization_photos/${logo_name}`, 1)
  return res.send(JSON.stringify({result: true}));
});


app.use('/api', apiRoute);



// --------------= Start server =----------------//

// Start server
server.listen(ENV.SERVER.SERVER_PORT);