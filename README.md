# qUI

### Prerequisites:

##### 1) Node JS V 4.1.1

Can be found at

> https://nodejs.org/dist/v4.1.1/node-v4.1.1-x64.msi

##### 2) Once the node is installed, install one hard dependency with

> npm install -g scp2

Required to enable you to use scp command from linux to be available as a global windows command.

##### 3) Local Setup

*For Local Deployment -*

> paths.js

*rootPath* - Where you want to listen for file changes.
*destinationPath* - Where you want file changes from **rootPath** to be deployed to.
The relative location of the files will be preserved.

*For Remote Deployment -*

> remote.js

Host and SSH credentials.
The tomcatPath variable specifies where the tomcat is located.


##### 4) Install all dependencies

Run the command

> npm install

##### 5) Start the application

> npm start
