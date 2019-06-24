#!/usr/bin/env python3
# -*- coding:utf-8 -*-
#getelum.py
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
            dataH = self.i2c.readfrom_mem(self._addr, 0x03, 2)[0]
            dataL = self.i2c.readfrom_mem(self._addr, 0x04, 2)[0]
        except Exception as e:
            return False
        E = '{:08b}'.format(dataH)[0:4]
        M = '{:08b}'.format(dataH)[4:] + '{:04b}'.format(dataL)
        exponent = 8*int(E[0]) + 4*int(E[1]) + 2*int(E[2]) + int(E[3])
        mantissa = 128*int(M[0]) + 64*int(M[1]) + 32*int(M[2]) + 16*int(M[3]) + 8*int(M[4]) + 4*int(M[5]) + 2*int(M[6]) + int(M[7])
        lum = ((2**exponent)*mantissa)*0.045
        return lum
