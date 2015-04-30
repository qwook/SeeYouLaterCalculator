# CAJE Stack
Coffeescript, Jade, Angular, Express  
"Good luck reading my source !!!!"

# Dependencies
This app uses gulp for task running.  
`npm install -g gulp`

# Building
`npm install`
`bower install`
  
To build the client bundle.js, run
`gulp watch`

# Running Server
`node index.js`

# Structure
./public/javascripts/bundle.js is automatically generated from the ./client/ folder.
/vendor/ is automatically generated from bower.
/server/ contains file pertaining to express an the API server