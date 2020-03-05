var cmd = require('./sudoBashCmd');
var bashexe = new cmd('orangepi');
bashexe.executeBashCmd('iptables -L');
