require("babel-core/register");
//disable
var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><body></body></html>');
var window = document.defaultView;

global.document = document;
global.window = window;

let temp = null;
const localS = {
    getItem: function(key) {
        return temp;
    },
    setItem: function(key, value) {
        temp = value;
    }
};

global.localStorage = localS;

propagateToGlobal(window);

function propagateToGlobal (window) {
    for(let key in window) {
        if(!window.hasOwnProperty(key)) {
            continue;
        }

        if(key in global) {
            continue;
        }
        global[key] = window[key];
    }
}