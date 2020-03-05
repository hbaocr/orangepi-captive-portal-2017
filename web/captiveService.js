/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var arp_util = require('arp');
var fs = require('fs');
var httpProxy = require('http-proxy');
var httpsProxy = require('http-proxy');
var http = require('http');
var http3 = require('http');
var url = require('url');

var cmd = require('./sudoBashCmd');
//var bashexe = new cmd('eeit');
////bashexe.executeBashCmd('ipconfig -a');
//bashexe.iptables_new_bypass_rule('192.168.1.1', 'aa:bb:cc:ss');
//bashexe.iptables_remove_bypass_rule('aa:bb:cc:ss');


const ap_ip = '127.0.0.1';
const http_captive_port = 8080;
const https_captive_port = 4443;

const http_splashpage_port = 8081;
const str_do_authorize = '/Sz8GTPqLmHfCakCGWeKs';
const splash_page = fs.readFileSync('./www/Sz8GTPqLmHfCakCGWeKs.html', 'utf8');
const pic_ = fs.readFileSync('./www/funpic.png');


const DEF_PERIOD_CONN_MS = 3600000;/*3600 sec = 1h*/
const DEF_PERIOD_CHECK_MS = 10000;/*10 sec = 1h*/
const SUDO_PASS = 'orangepi';
var app = require('./captiveService');
var appCaptiveService = new app(SUDO_PASS);

//appca.addNewDevToConnectedList('12:34:56:78:90', '192.168.1.1', '', 6000);
//appca.addNewDevToConnectedList('12:34:56:78:91', '192.168.1.2', '', 12000);
//appca.addNewDevToConnectedList('12:34:56:78:92', '192.168.1.3', '', 18000);
//appca.addNewDevToConnectedList('12:34:56:78:93', '192.168.1.4', '', 24000);

appCaptiveService.periodRun(DEF_PERIOD_CHECK_MS);




//https forward to http 
httpsProxy.createServer({
    target: {
        host: ap_ip,
        port: http_captive_port
    },
    ssl: {
        key: fs.readFileSync('./ssl/nginx.key', 'utf8'),
        cert: fs.readFileSync('./ssl/nginx.crt', 'utf8')
    }
}).listen(https_captive_port);


//http to http
var proxy = httpProxy.createProxyServer({});

http.createServer(function (request, response) {

    let pathname = url.parse(request.url).pathname;
    console.log(pathname);
    /*ignore '/favicon.ico'*/
    if (pathname === '/favicon.ico')
    {
        respo