/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var fs = require('fs');
var httpProxy= require('http-proxy');
var httpsProxy= require('http-proxy');
const str_login ='Sz8GTPqLmHfCakCGWeKs';
var proxy = httpProxy.createProxyServer({});

var httpCaptiveHandler = function(portal_link){
    this.portal_link=portal_link;    
};

httpCaptiveHandler.prototype.onHttpWifiCaptive=function(request,response){
    
    
};

httpCaptiveHandler.prototype.onHttpsWifiCaptive=function(request,response){
    
    
};
httpCaptiveHandler.prototype.onHttpWifiAuthorize=function(request,response){
    
    
};