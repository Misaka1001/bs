#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import network
import time
def do_connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect('runa','guojiaqi')

    if wlan.isconnected():
        print('network config:',wlan.ifconfig())
        return True
    else:
        time.sleep(3)
        do_connect()
