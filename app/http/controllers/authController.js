const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },

        postLogin(req, res, next) {
            const {email, password} = req.body
            if(!email || !password) {
                req.flash('error', 'All fields must be required');
                return res.redirect('/login');
            }

            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if(!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message);
                        return next(err);
                    }

                    return res.redirect(_getRedirectUrl(req));
                })
            })
        },

        register(req, res) {
            res.render('auth/register')
        },

        async postRegister(req, res) {
            const {name, email, password} = req.body

            if(!name || !email || !password) {
                req.flash('error', 'ALL FIELDS MUST BE REQUIRED');
                return res.redirect('/register');
            }

            User.exists({email: email}, (err, result) => {
                if(result) {
                    req.flash('error', 'Email already taken');
                    return res.redirect('/register');
                }
            })

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashedPassword
            })

            user.save().then((user) => {
                return res.redirect('/register')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
            })
        }
    }
}

module.exports = authController