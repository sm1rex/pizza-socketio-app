const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        //check if email exist
        // async await
        //async - первая функция, которая работает
        // await - функция, которая срабатывает после async, но при этом она независима от async
        const user = await User.findOne({email: email})
        if(!user) {
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                return done(null, user, {message: 'Logged in succesfully'});
            }
            return done(null, false, {message: 'Wrong username or password'});
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'});
        })
    }))



    // Сериализация - процесс перевода данных в последовательность байтов.
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })


    // DEСериализация - процесс перевода из последовательности байтов в данные.
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init;