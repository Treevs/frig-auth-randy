const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");

//POST new user route (optional, everyone has access)
router.post('/register', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    if (!user.username) {
        return res.status(422).json({
            errors: {
                username: 'is required',
            },
        });
    }

    var userQuery = User.findOne({ 'email': user.email }, function (err, data) {

        if (err) {
            //handle error
        } if (data != null) {
            return res.status(422).json({
                errors: {
                    email: 'already exists',
                },
            });
        } else {
            // console.log(data)
            const finalUser = new User(user);

            finalUser.setPassword(user.password);

            return finalUser.save()
                .then(() => res.json({ user: finalUser.toAuthJSON() }));
        }
    })
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {

        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.username = passportUser.username;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).json({
            errors: {
                usernameOrPassword: 'is incorrect',
            },
        });
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        })
})


router.post('/forgot', auth.optional, (req, res, next) => {
    //Forgot password, may not be neccesary
    const { body: { user } } = req;

    console.log(user);

    var userQuery = User.findOne({ 'email': user.email }, function (err, userResult) {
        if (err) {
            //handle error
        } if (userResult != null) {
            var secret = 'supersecret';
            var token = jwt.sign({ email: userResult.email }, secret, {expiresIn: "2h"});
            //Sign takes too long
            sendEmail(userResult.email, token);
            userResult.resettoken = token;
            userResult.save();
            
        } else {
            //Maybe don't send this
            console.log(userResult)
            return res.status(422).json({
                errors: {
                    user: 'does not exist',
                },
            });
        }
        return res.json({ message: "email sent" });
    })
})

router.post('/reset/', auth.optional, (req, res, next) => {
    const { body: { token, newPassword } } = req;
    var secret = 'supersecret';
    var decoded = jwt.verify(token, secret);
    var userQuery = User.findOne({ 'email': decoded.email })
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            user.setPassword(newPassword);
            user.save();
            return res.json({ user: user.toAuthJSON() });
        }).catch( (err) => {
            return res.sendStatus(400);
        })
})

router.post('/change/', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    const { body: { newPassword } } = req;
    var userQuery = User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            console.log(newPassword)
            user.setPassword(newPassword);
            user.save();
            return res.json({ user: user.toAuthJSON() });
        }).catch( (err) => {
            return res.sendStatus(400);
        })
})

router.get('/reset/:token', auth.optional, (req, res, next) => {

    var secret = 'supersecret';
    var token = req.params.token; //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InR2ci5qb21hckBnbWFpbC5jb20iLCJpYXQiOjE1ODE2NTUwMDV9.WoBxtQ627cZ_A-il1bfjYZeOSfVwbL87Z5SehpzqEzI
    var decoded = jwt.verify(token, secret);
    return res.json({decodedEmail: decoded})
})



async function sendEmail(email, token) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });
    console.log("<a href='http://localhost:3000/reset/"+token+"'>Click here to reset your password</a>");
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        // to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Click here to reset your password?", // plain text body
        html: "<a href='http://localhost:3000/reset/"+token+"'>Click here to reset your password</a>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = router;