#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import machine
import urequests as req
import json
import detection
import wifi

wifi.do_connect()
r = req.get('http://runasama.club/date')
date = json.loads(r.text)
machine.RTC().datetime(date)

detection.getValue()
