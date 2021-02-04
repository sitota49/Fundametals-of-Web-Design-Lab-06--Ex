/*
Here is the exercise on working on the remaining bom method

Location , Navigator , screen , Window

Follow the Instruction on the comments

1. Declare the UI Variables for selecting on the elements
2. Use the innerHTML property to display the result on each element
3. The Text  of the elements will lead you what bom information is required

Adding Extra is Possible if you want to explore more ...

Good Luck !!!
*/




// Define UI Variables  here 

const href = document.querySelector('#href');
const protocol = document.querySelector('#protocol');
const host = document.querySelector('#host');
const port = document.querySelector('#port');
const hostname = document.querySelector('#hostname');
const appname = document.querySelector('#appname');
const appversion = document.querySelector('#appversion');
const platform = document.querySelector('#platform');
const language = document.querySelector('#language');
const cookieenabled = document.querySelector('#cookieenabled');
const height = document.querySelector('#height');
const width = document.querySelector('#width');
const pixeldepth = document.querySelector('#pixeldepth');
const length = document.querySelector('#length');
const state = document.querySelector('#state');





// Display the BOM Information on the innerHTML of the elements

href.innerHTML = window.location.href;
protocol.innerHTML = window.location.protocol;
host.innerHTML = window.location.host;
port.innerHTML = window.location.port;
hostname.innerHTML = window.location.hostname;
appname.innerHTML = window.navigator.appName;
appversion.innerHTML = window.navigator.appVersion;
platform.innerHTML = window.navigator.platform;
language.innerHTML = window.navigator.language;
cookieenabled.innerHTML = window.navigator.cookieEnabled;
height.innerHTML = window.screen.height;
width.innerHTML = window.screen.width;
pixeldepth.innerHTML = window.screen.pixelDepth;
length.innerHTML = window.history.length;
state.innerHTML = window.history.state;