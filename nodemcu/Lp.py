#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import socket
from machine import ADC
import time
import json
host = '123.206.37.27'
port = 9000
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

adc = ADC(0)

def getValue():
    client.connect((host,port))
    i = 0
    while True:
        i += 1
        result = adc.read() / 10 + 30
        data = {
            'Lp':result,
            'time':946656000000 + time.time() * 1000
        }
        client.send(json.dumps(data) + '/')
        print('第' + str(i) + '次测量 Lp = ' + str(result) + 'dB')
        time.sleep(1)
