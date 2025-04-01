# Scripts and Tips for AudioCodes VoIP Phones

## AudioCodes 420HD - IP420HDE

Firmware Version 2.2.16.704

### Usage with FreeSWITCH

In general its best to use the `FreeSWITCH` setting in the Web Administration `Voice Over IP -> Services`.

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

#### DnD not working

Solution: In the Web Administration `Voice Over IP -> Services`, select `FreeSWITCH` as `Application Server` `Type`, then set `SLA TYPE` `Type` to `None`. Then it should work. Also make sure that further down on that page `DND (Do Not Disturb)` `Enable` is set to `Enable`.

### Triggering calls from KDE with Kontact or other applications

Download the bash script `audiocodes_dial_number.sh`. The script uses `curl`.
It is preconfigured with the default `1234` phone admin password. If you changed the admin password of your phone,
which you should, edit the script accordingly. Most importantly, set the IP address of your phone in the script.
Make the script executable.

Then go to the KDE System Settings -> Default Applications.
Click on the `Phone Numbers: ` drop down and choose `Other ...`.
In the appearing dialog, locate the downloaded script on top and at the bottom of the dialog
make sure its run in a Terminal, like in the screenshot below.

![Screenshot of KDE Settings](https://github.com/janbiedermann/audiocodes_voip_phone/blob/main/KDE_Settings.png?raw=true)

Then try in Kontact clicking on a phone number and it should dial. Takes a moment though, the phone is kinda slow to react.

### Lighting LEDs remotely

Two example scripts are provided, one to turn the LCD backlight and the message indicator LED on
`audiocodes_lights_on.sh` and one to turn them off `audiocodes_lights_off.sh`.
Both require `telnet` and `expect`. Please change the IP address and admin password in the scripts
accordingly and make sure `Telnet` is enabled in your phones Web Administration, `Management -> Remote Management`.
Many LEDs of the audiocodes phones can be controlled using the `led_ctrl` command of the phone, however, the
message indicator LED cannot be directly addressed. Turning this LED on/off only works by turning all LEDs on/off.
Thats why the 'lights on' script turns all LEDs on and then turns the others off again.
