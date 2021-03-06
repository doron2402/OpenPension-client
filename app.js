
/**
 * Module dependencies.
 */


var express = require('express')
  , routes = require('./routes')
  , index = require('./routes/index')
  , portfolio = require('./routes/portfolio')
  , staticpages = require('./routes/staticpages')
  , entry = require('./routes/entry')
  , http = require('http')
  , path = require('path')
  , FSUtil = require('./util/FSUtil')
  , csv = require('./routes/csv')
  , test = require('./routes/test')
  , toobusy = require('toobusy');
 

//enable use of Filter in client
FSUtil.copyFile('./core/filter.js', './public/js/filter.js',
			function(err){ 
				console.log(err);
				process.exit(1);
			}
		);
//enable use of Categories in client
FSUtil.copyFile('./core/categories.js', './public/js/categories.js',
      function(err){ 
        console.log(err);
        process.exit(1);
      }
    );

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  if (toobusy()) res.send(503, "I'm busy right now, sorry.");
  else next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', index.show);
app.get('/', entry.show);

app.get('/portfolio', portfolio.portfolio);
app.get('/investments', portfolio.investments);

app.get('/entry', entry.show);

app.get('/about', staticpages.about);

app.post('/list', test.list);
app.get('/list', test.list);

app.post('/group',test.post);
app.get('/group',test.get);
  
app.get('/csv',csv.download);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
