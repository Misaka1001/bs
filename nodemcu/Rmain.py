#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import machine
import urequests as req
import json
import lum
import wifi

while not wifi.do_connect():
    pass
wifi.do_connect()
r = req.get('http://runasama.club/date')
date = json.loads(r.text)
machine.RTC().datetime(date)

lum.getValue()
