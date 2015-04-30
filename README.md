# SeeYouLaterCalculator
It's a calculator.

# Understanding the Code
I would recommend starting at `client/main.js`.  
That is the starting point of the application.  
All the server does is delivers the client scripts to the browser.  
The server code is practically boilerplate and not very important to the project.

# Dependencies
Node.JS and NPM:  
https://nodejs.org/  
You can also download it from `brew` if you have brew on OSX.

This app uses *gulp* for task running.  
Gulp is used for simplifying complex tasks into a single command.  
You can think of Gulpfiles as Makefiles.  
To put it simple: instead of running ten different commands, you only run one.
`npm install -g gulp`

This app uses *bower* for managing client packages.  
Bower is usually used to download and maintain latest versions  
of packages like `jquery` or `angular`.
`npm install -g bower`

# Building
`npm install`
`bower install`
  
To build the client bundle.js, run
`gulp watch`

# Running Server
`gulp start`

# Structure
./public/javascripts/bundle.js is automatically generated from the ./client/ folder.
/vendor/ is automatically generated from bower and contains third-party libraries.
/server/ contains files pertaining to express and sending files.