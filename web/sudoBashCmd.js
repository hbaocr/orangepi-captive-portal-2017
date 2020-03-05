/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var node_cmd = require('node-cmd');
/*construct function */
var sudoBashCmd = function (default_pass = '') {

    this.sudo_pass = default_pass;

};

sudoBashCmd.prototype.setPassValue = function (str_pass) {
    this.sudo_pass = str_pass;
};

sudoBashCmd.prototype.executeBashCmd = function (cmd_str, cb = null, str_pass = null) {
    // let bash_cmd = "echo \"" + sudo_pass + "\" | sudo -S -k " + cmd;
    //update pass
    if (str_pass !== null) {
        this.sudo_pass = str_pass;
    }

    let bash_cmd = `echo "${this.sudo_pass}" | sudo -S -k ${cmd_str}`;
    console.log(bash_cmd);

    node_cmd.get(bash_cmd,
            function (data) {
                console.log('bash cmd output :\n\n', data);
                if (cb !== null)
                {
                    cb(data);
                }
            }
    );
};

sudoBashCmd.prototype.clearConntrackInfo = function (ip, port = null, tcp_state = 'ESTAB') {
    ///usr/sbin/conntrack -L  |grep 10.10.10.119  |grep ESTAB  |grep 'dport=80' |awk '{system("conntrack -D -p tcp -s substr($5,5) -d substr($6,5))");}'
    let cmd = "";
    let grep_port = "";
    let grep_state = "";
    if (port !== null)
    {
        grep_port = ` |grep 'dport=${port}'`; //string template in ES6 nodejs
    }
    if (tcp_state !== null)
    {
        grep_state = ` |grep ${tcp_state}`;
    }

    cmd = `conntrack -L |grep ${ip} ${grep_state} ${grep_port} |awk '{system("conntrack -D -p tcp -s " substr($5,5) " -d " substr($6,5));}'`;

    console.log(cmd);
    //sudo_bash_cmd(sudo_pass, cmd);
    this.executeBashCmd(cmd);
};
sudoBashCmd.prototype.iptables_new_bypass_rule = function (ip, mac, cb = null) {
    let ipt_cmd = `iptables -t mangle -I un_authorize_setmark 1 -m mac --mac-source ${mac} -j RETURN`;
    this.executeBashCmd(ipt_cmd);

    this.clearConntrackInfo(ip, 80);
    this.clearConntrackInfo(ip, 443);
};
sudoBashCmd.prototype.iptables_remove_bypass_rule = function (ip,mac, cb = null) {
    let ipt_cmd = `iptables -t mangle -D un_authorize_setmark -m mac --mac-source ${mac} -j RETURN`;
    this.executeBashCmd(ipt_cmd);
    this.clearConntrackInfo(ip, 80);
    this.clearConntrackInfo(ip, 443);
};

module.exports = sudoBashCmd;
