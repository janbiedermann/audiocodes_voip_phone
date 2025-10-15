#!/bin/bash
# Set the IP address of your phone:
PHONE="192.168.0.2"
# Dialing only works as admin.
# The admin password, base64 encoded with a '=' at the end:
PSW="MTIzNA=="
# Simple way to get what the phone expects in terms of Base64 encoding:
# With a browser visit the phones login page, open the browsers dev tools console and type:
# >> Base64.encode("1234")
# It then prints the encoded password: "MTIzNA==". Replace "1234" with your password.

COOKIE_JAR="${HOME}/.audiocodes_cookie.jar"

# Number is passed as uri like tel:+4912312345678, extract number and assign to variable:
NUMBER=`echo "$1" | cut -d ':' -f2`

echo "Number: ${NUMBER}"

# optional:
# read -p "Press enter to dial"

echo "Loggin in ..."
curl --insecure --silent --output /dev/null --cookie-jar $COOKIE_JAR --data-urlencode "user=admin" --data-urlencode "psw=${PSW}" --referer "https://${PHONE}/login.cgi" "https://${PHONE}/login.cgi"
echo "Dialing ..."
curl --insecure --silent --output /dev/null --cookie $COOKIE_JAR --data-urlencode "number=${NUMBER}" "https://${PHONE}/mainform.cgi/dial.htm"
echo "Ringing!"
sleep 5
