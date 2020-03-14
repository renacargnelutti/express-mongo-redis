
const express = require('express');
let router = express.Router();

const redisClient = require('../libs/redis-client');

const User = require('../models/user');

router.route('/')
    .get(async (req, res) => {

        try {
            let filter = {};
            if (typeof req.query.email !== 'undefined' && req.query.email) {
                filter.email = req.query.email;
            }

            let users = await User.find(filter).lean().exec();

            return res.status(200).json({ success: true, users });
        }
        catch (err) {
            if (typeof err.status !== 'undefined' && typeof err.error !== 'undefined') {
                return res.status(err.status).json({ success: false, error: err.error });
            }

            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

    })
    .post(async (req, res) => {

        try {
            const data = req.body;

            if (typeof data.email === 'undefined' || typeof data.name === 'undefined' || typeof data.last_name === 'undefined') {
                throw { status: 400, error: 'Bad Request' };
            }

            let user_data = {
                email: data.email,
                name: data.name,
                last_name: data.last_name,
            };

            let savedUser = await new User(user_data).save();

            return res.status(200).json({ success: true, user: savedUser });
        }
        catch (err) {
            if (typeof err.status !== 'undefined' && typeof err.error !== 'undefined') {
                return res.status(err.status).json({ success: false, error: err.error });
            }

            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    });

router.route('/:email')
    .get(async (req, res) => {

        try {
            if (typeof req.params.email === 'undefined') throw { status: 400, error: 'Bad Request' };
            let user = null;

            // find on Redis DB
            const rawData = await redisClient.getAsync(req.params.email);

            if (rawData === null) {
                // find on Mongo DB
                user = await User.findOne({ email: req.params.email }).lean().exec();

                // save to Redis
                await redisClient.setAsync(req.params.email, JSON.stringify(user));
            }
            else {
                user = JSON.parse(rawData);
            }

            return res.status(200).json({ success: true, user });
        }
        catch (err) {
            if (typeof err.status !== 'undefined' && typeof err.error !== 'undefined') {
                return res.status(err.status).json({ success: false, error: err.error });
            }

            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

    });

module.exports = router;
