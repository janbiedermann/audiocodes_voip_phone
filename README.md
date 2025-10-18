<img src="https://raw.githubusercontent.com/janbiedermann/audiocodes_voip_phone/master/audiocodes-420hd.webp" alt="AudioCodes 420HD">

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

Solution: In the Web Administration `Voice Over IP -> Services`, select `FreeSWITCH` as `Application Server` `Type`,
then set `SLA TYPE` `Type` to `None`. Then it should work. Also make sure that further down on that page
 `DND (Do Not Disturb)` `Enable` is set to `Enable`.

### Triggering calls via tel: or callto: URLs from KDE (CTI)

Download the bash script `audiocodes_dial_number.sh`. The script uses `curl`.
It is preconfigured with the default `1234` phone admin password. If you changed the admin password of your phone,
which you should, edit the script accordingly. Most importantly, set the IP address of your phone in the script.
Make the script executable.

Then go to the KDE System Settings -> Default Applications.
Click on the `Phone Numbers: ` drop down and choose `Other ...`.
In the appearing dialog, locate the downloaded script on top and at the bottom of the dialog
make sure its run in a Terminal, like in the screenshot below.

![Screenshot of KDE Settings](https://github.com/janbiedermann/audiocodes_voip_phone/blob/main/KDE_Settings.png?raw=true)

Then try in Kontact clicking on a phone number and it should dial. Takes a moment though, the phone is a bit slow
to react.

### Triggering calls via tel: or callto: URLs from XFCE (CTI)

Download the bash script `audiocodes_dial_number.sh`. The script uses `curl`.
It is preconfigured with the default `1234` phone admin password. If you changed the admin password of your phone,
which you should, edit the script accordingly. Most importantly, set the IP address of your phone in the script.
Make the script executable.

Download the `teldial.desktop` file, adjust the path to the `audiocodes_dial_number.sh` script at the `Exec` key.
Then copy the file to your `~/.local/share/applications/` directory.

Add the following lines to the `~/.local/share/applications/mimeapps.list` file, `[Added Associations]` section:
```
[Added Associations]
x-scheme-handler/tel=teldial.desktop
x-scheme-handler/callto=teldial.desktop
```

And done. Now it should be possible to trigger phone calls by clicking tel: links in a browser or via:
`xdg-open tel:12344545`
or:
`exo-open tel:12346465`

If it does not work right away, you may need to log out and log in again.

### Lighting LEDs remotely

Two example scripts are provided, one to turn the header LED (thats the blue one at the top right corner of the device)
on `audiocodes_lights_on.sh` and one to turn it off `audiocodes_lights_off.sh`.
Both require `telnet` and `expect`. Please change the IP address and admin password in the scripts
accordingly and make sure `Telnet` is enabled in your phones Web Administration, `Management -> Remote Management`.
All LEDs of the audiocodes phones can be controlled using the `led_ctrl` command of the phone.

### Compiling Executables

I had success using [crosstool-ng](https://crosstool-ng.github.io/) to compile a simple *.c file for the phone.
The file `crosstool-ng.config` contains the crosstool-ng configuration that worked.
Copy it to `.config` in your crosstool-ng directory.

After compiling, the resulting binary can be transferred to the phone via wget. Make the file available for download
from a web server, login to the phone via telnet, cd to `/tmp` and use wget to download the binary.
Then chmod +x the file and its ready to execute. Be aware that the files in `/tmp` are deleted on each restart.

### Expanding the capabilites or API of the included Web Server

In the `/tmp` directory of the phone is a file `lighttpd_access.conf`, which is included by the lighttpd config.
Simply edit that file to provide a url rewrite or whatever you need to get your cgi executable working.
Then restart lighttpd with `/home/ipphone/scripts/httpd_restart.sh` and your cgi should work.
Be aware that the `/tmp/lighttpd_access.conf` config file is deleted and recreated on each restart of the phone or the
control-center application.

### Analyzing the Firmware

The phone has 8 MB flash devided into 5 flash areas, summary:
```
dev:    size   erasesize  name bytesize usage
mtd0: 00580000 00010000 "mtd0"  5767168 ro / squashfs
mtd1: 00100000 00010000 "mtd1"  1048576 Linux zImage
mtd2: 00010000 00002000 "mtd2"    65536 the boot loader
mtd3: 00160000 00010000 "mtd3"  1441792 rw /phone jffs2 for configuration
mtd4: 00010000 00010000 "mtd4"    65536 env_mtd, storing some hardware configuration parameters
                               --------
                                8388608
```

`cat /proc/avalanche/env` provides the information.

The device is set to boot from mtd1:
```
BOOTCFG m:f:"mtd1"
```

There is a `/bin/flasher` executable contained in the original firmware.
It can provide more information about the image with `flasher i 420HD_2.2.16.704.img`:
```
       HW     SW          HVer  nsect   hlen  magic       chksum  Attr  Date                 CE5
Image: 420HD  2.2.16.704    15      5    112  2863311530    1798  0001  2024-10-09_06:15:40

         Name            Type  Ver       len      hlen  magic       chksum     len
section: psbl.bin         004  16842763    60046   096  3149642683    6894004    60048  0000  boot loader
section: ram_zimage.bin   002  00000000   943140   096  3149642683  127490864   943144  0000  Linux zImage
section: rootfs.sqfs      001  00000000  5701632   096  3149642683  726657068  5701632  0000  root squashfs
section: phone.img        003  00000000    65536   096  3149642683   16289901    65536  0000  phone jffs2
section: section.map      040  00000000      632   096  3149642683      41172      632  0000
section: flasher          104  00720920   132243   096  3149642683    8615196   132248  0000
```

All the IP Phone related software is stored in /home/ipphone on the root filesystem.

Its using:
Squashfs 2.1-r2 (released 2004/12/15) (C) 2002-2004 Phillip Lougher
Squashfs 2.2 includes LZMA decompression support

The lzma compressor uses some custom parameters. So far i had no luck creating a compatible squashfs image.

The mtdblock3 JFFS2 is used for storing the configuration.

### Recovering the Phone

The phone can be recoverd via a serial interface and connected network.
The interface is on top of the phone, inside, behind the display.
Taking it apart is easy, just 5 screws at back and a clip on the middle of each side.
When booting with the serial interface connected, pressing ESC will interrupt the bootloader and present a console.
`help` will show available commands.
The `upgrade` command can be used to get a firmware image via DHCP + TFTP.
In DHCP option 67 must be set to the firmware image name.
The phone will download the firmware, flash it and reboot.

So never ever modify the first section (psbl.bin) of the firmware image!
