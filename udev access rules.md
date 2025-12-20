# Udev rules to manage peripherals through chrome/chromium

Type `lsusb | grep -i <your_device>` to find the device you're looking for


Then keep these highlighted properties:

> Bus 007 Device 003: ID <span style="background-color: #FFFF00">1915:ae8c</span> Nordic Semiconductor ASA Ninjutso Sora V2 8K

Create a new file under `/etc/udev/rules.d`, name it something like `101-mice-rules.rules` (the number at the start is important because udev uses that to load modules in order)

Then add 

```
# sora v2 wireless
ACTION=="add|change", SUBSYSTEM=="usb", ATTRS{idVendor}=="1915", ATTRS{idProduct}=="ae8c", TAG+="uaccess"

# sora v2 wired
ACTION=="add|change", SUBSYSTEM=="usb", ATTRS{idVendor}=="1915", ATTRS{idProduct}=="ae11", TAG+="uaccess"
```

where `ATTRS{idVendor}` and `ATTRS{idProduct}` correspond to the highlighted text above.

then you can reboot or run `sudo udevadm control --reload-rules && sudo udevadm trigger`
