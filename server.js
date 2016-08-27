const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dbhandler = require('./dbhandler');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',express.static('public'));

app.set('port',process.env.PORT || 5000);

app.get('/newuser',function (req,res) {

    var obj= {
        name : req.query.name,
        pswd : req.query.pswd
    };

    dbhandler.new_user(obj,function (result) {

        if(result==0)
            res.send("no");
        else
            res.send("yes");
    });

});


app.get('/fetchdata',function (req,res) {

    dbhandler.fetch_score(function (result) {
        res.send(result);
    })
});


app.get('/checkuser',function (req,res) {

    var obj = {
        name:req.query.name,
        pswd : req.query.pswd
    };

    dbhandler.check_user(obj,function (result) {

        res.send(result);
    })
});


app.get('/updatescore',function (req,res) {

    var obj= {
        username : req.query.username,
        score: req.query.score,
        level : req.query.level
    };

    dbhandler.update_score(obj,function (result) {

        res.send("");
    });
});


app.get('/getlevel',function (req,res) {

    var obj= {
        username : req.query.username
    };
    dbhandler.get_level(obj,function (result) {

        res.send(result);
    });

});
app.listen(app.get('port'),function () {

    console.log("Server started and listening at port " + app.get('port'));
});


