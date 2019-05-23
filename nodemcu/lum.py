#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import socket
import time
import max44009

host = '123.206.37.27'
port = 9000
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((host, port))

def getValue():
    lum = max44009.MAX44009()
    i = 0
    while True:
        i += 1
        result = lum.luminosity()
        client.send(str(result).encode())
        print('第' + str(i) + '次测量 lum = ' + str(result) + 'lux')
        time.sleep(1)
