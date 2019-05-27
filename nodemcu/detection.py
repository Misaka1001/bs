#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import socket
import time
import max
import getLp
import json
host = '123.206.37.27'
port = 9000
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

def getValue():
    client.connect((host, port))
    getlum = max.MAX44009()

    i = 0
    while True:
        i += 1
        Lp = getLp.getValue()
        luminance = getlum.luminosity()
        if not luminance:
            continue
        if luminance > 188000 :
            continue
        data = {
            'Lp':Lp,
            'luminance':luminance,
            'time':946656000000 + time.time() * 1000
        }
        client.send(json.dumps(data) + '/')
        print('第' + str(i) + '次测量 lum = ' + str(luminance) + 'lux, Lp=' + str(Lp))
        time.sleep(1)
