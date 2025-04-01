#!/bin/bash

# change IP address (192.168.0.1) and password (1234) below

expect << EOF
spawn telnet 192.168.0.1
expect -ex "420HD login: "
send "admin\n"
expect -ex "Password: "
send "1234\n"
expect -ex "\[admin@420HD ~\]$ "
send "led_ctrl all off\n"
expect -ex "\[admin@420HD ~\]$ "
send "exit\n"
exit
EOF
