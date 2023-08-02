const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function (req, res){
    Article.find().then(function (articles){
        res.send(articles);
    }).catch(function (err){
        res.send(err);
    });
})

.post(function(req, res){
    Article.create({
        title: req.body.title,
        content: req.body.content
    }).then(function (){
        res.send("Posted 1 entry to articles collection.");
    }).catch(function (err){
        res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteMany({}).then(function(){
        res.send("Deleted all the entries in articles collection.");
    }).catch(function(err){
        res.send(err);
    });
});

/* Targeting specific articles */

app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle)
            res.send(foundArticle);
        else
            res.send("No article with provided title name found.");
    }).catch(function(err){
        res.send(err);
    });
})

.put(function(req, res){
    Article.replaceOne( {title: req.params.articleTitle}, 
                        {title: req.body.title,
                         content: req.body.content,
                        }
                   )
    .then(function (){
    res.send("PUT request carried out successfully.");
    }).catch(function (err){
        res.send(err);
    });
})

.patch(function(req, res){
    Article.updateOne({title: req.params.articleTitle},
                      {$set: req.body}
                     ).then(function(){
        res.send("Successfully executed PATCH request.");
    }).catch(function(err){
        res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}).then(function(){
        res.send("Deleted the article with provided title name.");
    }).catch(function(err){
        res.send(err);
    });
});


app.listen(3000 || process.env.PORT_NO, function(){
    console.log("Server hosted at port 3000.");
});