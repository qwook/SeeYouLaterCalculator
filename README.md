# SeeYouLaterCalculator
It's a calculator. http://qwook.github.com/SeeYouLaterCalculator/

# Understanding the Code
I would recommend starting at `client/main.js`.  
That is the starting point of the application.  
All the server does is delivers the client scripts to the browser.  
The server code is practically boilerplate and not very important to the project.

# Frameworks
## Client:
**Angular** - handles MVC  
**BabelJS** - allows for usage of latest javascript version  
	it just translates latest javascript version so that older javascript engines can use it.  
**Jade** - translates to HTML, used for templates and defining the html of buttons and layout  
  
## Server:
**Webpack** - compiles all the clientside scripts into one file
**Express** - framework used to host the website (higher level than nodejs, allows hosting websites with smaller amounts of commands.)
**NodeJS** - the engine used to host the website (built on C++/v8 interprets javascript)
  
## Development:
Grunt which is used as like "make"  
	automates commands needed to compile for client and server.
  
# Dependencies
Node.JS and NPM:  
https://nodejs.org/  
You can also download it from `brew` if you have brew on OSX.

This app uses ***grunt*** for task running.  
Gulp is used for simplifying complex tasks into a single command.  
You can think of Gulpfiles as Makefiles.  
To put it simple: instead of running ten different commands, you only run one.  
`sudo npm install -g grunt`

This app uses ***bower*** for managing client packages.  
Bower is usually used to download and maintain latest versions  
of packages like `jquery` or `angular`.  
`sudo npm install -g bower`

# Building
`sudo npm install`
`bower install`
  
To build the client bundle.js, run
`grunt bundle`

# Running Server
`grunt server`
