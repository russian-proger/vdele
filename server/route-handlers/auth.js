const crypto = require('crypto');
const utils = require('../utils');

/**
 * @param {import('../core')} core
 */
function Auth(core) {
    const app = core.GetApp();
    const User = core.GetModel('User');
    const Token = core.GetModel('AccessToken');

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
        if (utils.expressions.mail_expr.test(data.login)) {
            // login is a mail
            uinfo = await User.findOne({ where: {mail: data.login}});
        } else if (utils.expressions.nick_expr.test(data.login)) {
            // login is a nickname
            uinfo = await User.findOne({ where: {nick: data.login}});
        } else {
            return res.render('login', { incorrect_login: true });
        }
    
        if (uinfo !== null) uinfo = uinfo.dataValues;

        if (uinfo === null) {
            return res.render('login', { incorrect_login: true });
        } else if (uinfo.password != data.password) {
            return res.render('login', { incorrect_password: true });
        }
    
        const key = crypto.generateKeySync('hmac', { length: 256 }).export().toString("hex");
        const token = `${uinfo.id}_${key}`;
        let cookieOptions = new Object();
    
        if (data.remember || true) {
            cookieOptions.expires = new Date(Date.now() + 28*24*60*60*1000);
            // Token.create({

            // })
            // addNewSignToken(uinfo.id, token, cookieOptions.expires);
            Token.create({
                token,
                endAt: cookieOptions.expires,
                UserId: uinfo.id
            });
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
        if (req.body && await utils.express.IsValidSignUpForm(req.body)) {
            const user = User.create({
                nick: req.body.nick,
                mail: req.body.mail,
                password: req.body.password,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                photoName: `${req.body.nick}.png`
            });

            utils.image.GenerateRandomImage(`${__dirname}/../../resources/profile_photos/${req.body.nick}.png`);
    
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
        if (req.is_auth) {
            const token = Token.findOne({
                where: {token: req.cookies['sign_token'], UserId: req.cookies['user_id']}
            });
            if (token !== null) {
                (await token).destroy();
            }
        }
        return res.redirect('/');
    });
}

module.exports = Auth;