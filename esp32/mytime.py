#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# mytime.py
import time

class MyTime:
    """
    封装时间对象，初始化系统时间，提供获取时间戳的函数
    """

    def __init__(self):
        import json
        from machine import RTC
        import urequests as req
        response = req.get('http://runasama.club/date')
        date = json.loads(response.text)
        RTC().datetime(date)

    def time_stamp(self):
        return 946656000000 + time.time() * 1000
