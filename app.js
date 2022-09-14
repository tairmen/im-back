require("dotenv").config();
const express = require("express");
const cors = require('cors')
const get_routes = require("./routes/index");

const app = express();

app.use(express.json());
app.use(cors());

const sequelize = require("./config/database");
const models = sequelize.models;

setTimeout(() => {
    models.Api.findAll().then(res => {
        if (!res || !res.length) {
            models.Api.create({
                url: 'https://api-sandbox.bitpace.com/api/v1',
                merchant_code: '10906133550',
                merchant_password: '7cc3fa58-9b4a-4848-8342-6e8f6cfb9881',
                secret: '0635531309',
                token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoOER5QjYxdTFvTy1lSERSZ0lYMTUwY3l1YzNSWmFTbDNlS0RQWjY3c1BzIn0.eyJqdGkiOiIxYjY3YmJhNS04MTE4LTQ1MjItYjRmNC1iYWY3YzNlZWM4YzUiLCJleHAiOjE2NjMxNzg1MDIsIm5iZiI6MCwiaWF0IjoxNjYzMTQyNTAyLCJpc3MiOiJodHRwczovL2F1dGgtc2FuZGJveC5iaXRwYWNlLmNvbS9hdXRoL3JlYWxtcy9iaXRwYWNlIiwic3ViIjoiMzk2MDQ4MDMtMGYyNC00ZDEyLWJiYWYtZDMzMmY3MGRiMWUxIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVyY2hhbnQtYXBpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiZjMxZjU4ODAtYjQzMi00MjAyLWI1MTQtMjViNDg1Y2ZiMWExIiwiYWNyIjoiMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJyb2xlcyI6WyJXSVRIRFJBVyIsIlBBWU1FTlQiLCJTRUxMIiwiQlVZIiwiREVQT1NJVCJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxMDkwNjEzMzU1MCIsIm1lcmNoYW50X2lkIjoiNDg2In0.ULH471TP6SIoCyYnc-glV7RYL6U4pk100_8SFtZYYuDpsipFi09hzv24NgvJPfveFL3-Ie1B-_SUS6s4JI0KoQCrmM7S_ftfebFiw7eeCo9ycQUD45XEZBFMvZ8hteUvJaq_NZyzkfAAAbvQtYezWvpui-Vc_qs7f7ay2ka-9HhtLFBKBHB2FSGh_vGTTrERcOz9wLO8tI6BP8qk18_yMmTPICRzwZv_y8Hgd4WJ3p8_REWWl2FTtVE3SYao6SBFRxEGXhxDI7YOhBN7M7Dkk_aJq0hjABwi3oGSOkBNm4YU2zv0capuh4wHFJwQ3V5AxQL04vYd46pMxVgyORjdsg',
                front: 'localhost:3000/main',
            })
        }
    })
}, 3000)

get_routes(app, models);

module.exports = app;