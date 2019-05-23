#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import socket
import time
import max44009
import json
host = '123.206.37.27'
port = 9000
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

def getValue():
    client.connect((host, port))
    lum = max44009.MAX44009()
    i = 0
    while True:
        i += 1
        result = lum.luminosity()
        data = {
            'luminance':result,
            'time':946656000000 + time.time() * 1000
        }
        client.send(json.dumps(data) + '/')
        print('第' + str(i) + '次测量 lum = ' + str(result) + 'lux')
        time.sleep(1)
