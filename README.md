# Scripts and Tips for AudioCodes VoIP Phones

## AudioCodes 420HD - IP420HDE

Firmware Version 2.2.16.704

### Problems with FreeSWITCH

#### Registration Failure when using outbound proxy

Solution: set outbound proxy port to 0

#### Calls breaking

Solution: use only those codecs that the FreeSWITCH can accept

Procedure:

In the Web Administration login as admin, go to `Voice Over IP -> MediaStreaming`.
Make a list of the available codecs from a codec drop down.
In `Voice Over IP -> MediaStreaming` select only one codec in position 1, set the others to none.
Try calling inbound and outbound.
If the codec works in one call direction, mark it on your list.
Try that for all available codecs.
When done, select the marked codecs from your list and assign them the positions from top in
`Voice Over IP -> MediaStreaming`, set the others to none.
Thats it. Now calls should work.

### Triggering calls from KDE with Kontact or other applications

Download the bash script `audiocodes_dial_number.sh`. The script uses curl, so make sure you have that.
It is preconfigured with the default `1234` phone admin password. If you changed the admin password of your phone,
which you should, edit the script accordingly. Most importantly, set the IP address of your phone in the script.
Make the script executable.

Then go to the KDE System Settings -> Default Applications.
Click on the `Phone Numbers: ` drop down and choose `Other ...`.
In the appearing dialog, locate the downloaded script on top and at the bottom of the dialog
make sure its run in a Terminal, like in the screenshot below.

![Screenshot of KDE Settings](https://github.com/janbiedermann/audiocodes_voip_phone/blob/main/KDE_Settings.png?raw=true)

Then try in Kontact clicking on a phone number and it should dial. Takes a moment though, the phone is kinda slow to react.
