// --------------= Import =----------------//

// Standart libraries
const fs        = require('fs');
const http      = require('http');

// External libraries
const express   = require('express');
const mysql = require('mysql2');

// My .js files
const iniParser   = require('./ini-parser');
const expressions = require('./expressions');
const image_tool  = require('./image');
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


// --------------= Functions =----------------//
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
    pool.execute('SELECT mail FROM `user` WHERE mail=?', [mail], function(err, result) {
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
function getUserNick(nick) {
  return new Promise(resolve => {
    pool.execute('SELECT nick FROM `user` WHERE nick=?', [nick], function(err, result) {
      if (err) {
        console.error(err.message);
        resolve(1);
      }
      resolve(result[0]);
    });
  })
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
  ) { return ({ result: false }); }

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
    await getUserNick(form.nick) !== undefined
  ) { return false; }

  return true;
}


// --------------= Routes =----------------//

app.use(express.urlencoded({ extended: true }));

// Main route
app.get('/', (req, res) => {
  sendView(res, 'welcome.html');
});

app.get('/login', (req, res) => {
  sendView(res, 'login.html');
});

app.post('/login', (req, res) => {
  /** @type {SignInFormData} */
  const data = req.body;
  if (data && data.login && data.password) {
    let uinfo;
    if (expressions.mail_expr.test(data.login)) {
      // login is a mail
      uinfo = getUserByMail(data.login);
    } else if (expressions.nick_expr.test(data.login)) {
      // login is a nickname
      uinfo = getUserByMail(data.login);
    } else {
      return sendView(res, 'login.html');
    }
  }

  sendView(res, 'login.html');
});

app.get('/signup', (req, res) => {
  sendView(res, 'signup.html');
});

app.post('/signup', async (req, res) => {
  if (req.body && await isValidSignUpForm(req.body)) {
    await addNewUser(req.body);

    sendView(res, 'welcome.html');
  } else {
    sendView(res, 'signup.html');
  }
  res.end();
  return;
});

app.get('/auth_vk', (req, res) => {
  sendView(res, 'auth_vk.html');
});

// Folders
app.use('/scripts', express.static(`${__dirname}/../source/scripts`));
app.use('/dist', express.static(`${__dirname}/../dist`));




// --------------= Start server =----------------//

// Start server
server.listen(ENV.SERVER.SERVER_PORT);