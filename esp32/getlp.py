#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# getlp.py
class GetLp:
    """
    通过向板载噪声模块发送问询帧，获取测量数据
    """
    query = bytearray([0x01,0x03,0x00,0x00,0x00,0x01,0x84,0x0A])
    def __init__(self):
        from machine import UART
        self.uart = UART(2, 9600)

    def get_value(self):
        val = self.uart.read()
        self.uart.write(self.query)
        if val != None:
            val = int('0x' + hex(val[3])[2:] + hex(val[4])[2:])
            return val / 10
        else:
            return False
