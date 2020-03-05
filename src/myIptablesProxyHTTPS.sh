#!/bin/bash
#write by duong huynh bao
#duonghuynhbaocr@gmail.com
# iptables firewall script
#

DNS_FAKE_PORT=5335
HTTP_FAKE_PORT=8800
HTTPS_FAKE_PORT=8801

HTTP_MARK_NUMBER=80
HTTPS_MARK_NUMBER=81
DNS_MARK_NUMBER=80

UN_AUTHORIZE_MARK_NUMBER=83

NET_IFACE=eth0
AP_IFACE=wlan1

AP_IP=10.10.10.1

IPTABLES=/sbin/iptables
echo " *****************Starting config firewall******************"
echo " * flushing old rules"
${IPTABLES} --flush
${IPTABLES} --table nat --flush
${IPTABLES} --table mangle --flush

${IPTABLES} --table nat --delete-chain
${IPTABLES} --delete-chain
#make sure delete-chain
${IPTABLES} -t mangle -X 
${IPTABLES} -t nat -X 
${IPTABLES} -X 


#zero chain
${IPTABLES} -Z 

echo " * allowing loopback devices"
${IPTABLES} -A INPUT -i lo -j ACCEPT
${IPTABLES} -A OUTPUT -o lo -j ACCEPT

echo " * allowing net devices"
${IPTABLES} -A INPUT -i ${NET_IFACE} -j ACCEPT
${IPTABLES} -A OUTPUT -o {NET_IFACE} -j ACCEPT

echo " * allowing net devices"
${IPTABLES} -A INPUT -i ${NET_IFACE} -j ACCEPT
${IPTABLES} -A OUTPUT -o {NET_IFACE} -j ACCEPT

echo " * not allowing ssh/tellnet from ap"
${IPTABLES} -A INPUT -i ${AP_IFACE} -p tcp -d ${AP_IP} --dport 22 -j ACCEPT
${IPTABLES} -A INPUT -i ${AP_IFACE} -p tcp -d ${AP_IP} --dport 23 -j ACCEPT
#AP_IP accept
${IPTABLES} -A INPUT -i ${AP_IFACE} -p tcp -d ${AP_IP} --dport 80 -j ACCEPT

#AP_DNS accept
${IPTABLES} -A INPUT -i ${AP_IFACE} -p udp -d ${AP_IP} --dport 53 -j ACCEPT

echo " * mangle table -->set mark packet to authorize "

#mangle table create chain authorize
${IPTABLES} -t mangle -N un_authorize_setmark

#set mark trafic to un_authorize chain
${IPTABLES} -t mangle -A PREROUTING -i ${AP_IFACE} -p tcp -m tcp --dport 80  -j un_authorize_setmark
${IPTABLES} -t mangle -A PREROUTING -i ${AP_IFACE} -p tcp -m tcp --dport 443 -j un_authorize_setmark
${IPTABLES} -t mangle -A un_authorize_setmark -j MARK --set-mark ${UN_AUTHORIZE_MARK_NUMBER}

echo " * nat table -->check mark packet then nat to authorize app "

${IPTABLES} -t nat -A PREROUTING -i ${AP_IFACE} -p tcp -m mark --mark ${UN_AUTHORIZE_MARK_NUMBER} -m tcp --dport 80 -j DNAT --to-destination ${AP_IP}:${HTTP_FAKE_PORT}
${IPTABLES} -t nat -A PREROUTING -i ${AP_IFACE} -p tcp -m mark --mark ${UN_AUTHORIZE_MARK_NUMBER} -m tcp --dport 443 -j DNAT --to-destination ${AP_IP}:${HTTPS_FAKE_PORT}

echo " * nat table -->MASQUERADE forwarding of requests from anywhere to NET_IFACE"
#allow forwarding of requests from anywhere to NET_IFACE(eth0)/WAN
iptables -t nat -A POSTROUTING -o ${NET_IFACE} -j MASQUERADE
echo " ****************Firewall OK***************************"

