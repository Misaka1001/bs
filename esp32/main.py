#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# main.py
import wifi
import mytime
import mysocket
import getlp
import getlum
import time
import json
from machine import unique_id
host = '123.206.37.27'
port = 9000
wifi.do_connect()
socket = mysocket.MySocket(host, port)
time_stamp = mytime.MyTime().time_stamp
lum = getlum.GetLum().get_value
lp = getlp.GetLp().get_value
id = unique_id()
device_id = hex(id[0])[2:] + ':' + hex(id[1])[2:] + ':' + hex(id[2])[2:] + ':' + hex(id[3])[2:] + ':' + hex(id[4])[2:] + ':' + hex(id[5])[2:]
def send_message():
    i = 0
    while True:
        i += 1
        data = {
            'device_id': device_id,
            'Lp': lp(),
            'lum': lum(),
            'time': time_stamp()
        }
        if data['Lp'] is False or data['Lp'] < 30 or data['lum'] is False or data['lum'] > 188000:
            time.sleep(1)
            continue
        # print('检测时间：' + str(data['time']))
        # print('第'+ str(i) +'次测量, 噪声为' + str(data['Lp']) + 'dB, 光照为' + str(data['lum']) + 'lx')
        socket.send_message(data)
        time.sleep(1)
send_message()
