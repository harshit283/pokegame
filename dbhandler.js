const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = "mongodb://game:HARSHITagg123@ds145325.mlab.com:45325/pokemon_game";


function check_user(obj,callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        handler.find({'username':obj.name,'password':obj.pswd}).toArray(function (err,result) {

            assert.equal(err,null);
            var sol = {};
            sol.ans = result.length;
            if(result.length)
            {
                sol.level = result[0].level;
            }

            db.close();
            callback(sol);

        });
    });
}




function new_user(obj,callback) {


    mongoClient.connect(url,function (err,db)
    {
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username':obj.name}).toArray(function (err,docs) {
            assert.equal(err,null);
            if(docs.length==0)
            {
                handler.insertOne(
                    {
                        'username':obj.name,
                        'password':obj.pswd,
                        'score':0,
                        'level':1
                    },function (err,result) {

                        assert.equal(err,null);
                        db.close();
                        callback(1);
                    }
                )
            }
            else
            {
                db.close();
                callback(0);
            }
        });

    });

}

function fetch_score(callback) {

    mongoClient.connect(url,function (err,db) {

        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.find({}).sort({'score':-1}).toArray(function (err,docs) {

            assert.equal(err,null);
            db.close();
            callback(docs);
        })

    });
}


function get_level(obj,callback) {

    mongoClient.connect(url,function (err,db) {

        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.find({'username':obj.username}).toArray(function (err,docs) {

            assert.equal(err,null);
            db.close();
            callback(docs);
        })

    });
}


function update_score(obj,callback) {

    mongoClient.connect(url,function (err,db) {

        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.find({'username':obj.username}).toArray(function (err,docs) {

            assert.equal(err,null);
            var new_level;
            var new_score = docs[0].score + Number(obj.score);

            if(docs[0].level < Number(obj.level) )
                new_level = Number(obj.level);

            else
                new_level = docs[0].level;

            handler.updateOne({'username':obj.username},
                {$set : {'score' : new_score , 'level':new_level}},
                function (err,result) {

                    assert.equal(err,null);
                    db.close();
                    callback(result);
                }

            )
        });

    });
}


module.exports = {

    new_user : new_user,
    check_user : check_user,
    fetch_score: fetch_score,
    update_score : update_score,
    get_level:get_level

};
