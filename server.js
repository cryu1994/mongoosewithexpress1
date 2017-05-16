var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quote');
mongoose.Promise = global.Promise;
var QuoteSchema = new mongoose.Schema({
  name:{ type:String, required: true,  minlength: 2},
  quote: {type: String, required: true, minlength: 2}
}, {timestamp: true});

mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'

app.get('/', function(req, res){
  res.render('index');
});
app.post('/quotes', function(req, res){
  console.log("POST DATA", req.body);

  var quote = new Quote({name: req.body.name, quote: req.body.quote});
  quote.save(function(err){
    if(err){
      console.log(quote.errors);
      res.render('index', {title: 'You have errors!'})
    }
    else{
      console.log("success");
      res.redirect('/success');
    }
  })
});
app.get('/success', function(req, res){
  Quote.find({}).sort('-createdAt').exec(function(err, quotes){
    if(err){
      console.log(err);
      res.render('success', {title: 'you have errors!', errors: quote.errors})
    }
    else{
      res.render('success', {quotes: quotes});
    }
  })
})
app.listen(8000, function(){
  console.log("awesome web on the localhost: 8000")
});
