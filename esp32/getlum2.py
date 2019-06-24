#!/usr/bin/env python3
# -*- coding:utf-8 -*-

class GetLum:
    """
    读取GY-39输出数据
    """
    def __init__(self):
        from machine import Pin, I2C
        self.i2c = I2C(scl=Pin(22), sda=Pin(21))
        self._addr = 0x4a

    def get_value(self):
        try:
            data = self.i2c.readfrom_mem(self._addr, 0x03, 2)
        except Exception as e:
            return False
        exponent = (data[0] & 0xF0) >> 4
        mantissa = ((data[0] & 0x0F) << 4) | (data[1] & 0x0F)
        lum = ((2 ** exponent) * mantissa) * 0.072
        return lum

from machine import I2C, Pin
i2c = I2C(scl=Pin(22),sda=Pin(21))
addr = i2c.scan()
data = i2c.readfrom_mem(0x4a,0x03,2)
data[0]
