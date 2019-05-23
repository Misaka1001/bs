#!/usr/bin/env python3
# -*- coding:utf-8 -*-

class MAX44009():
    _REG_INTERRUPT_STATUS = 0x00
    _REG_INTERRUPT_ENABLE = 0x01
    _REG_CONFIGURATION    = 0x02
    _REG_LUX_HIGH_BYTE    = 0x03
    _REG_LUX_LOW_BYTE     = 0x04
    _REG_UPPER_THRESHOLD  = 0x05
    _REG_LOWER_THRESHOLD  = 0x06
    _REG_TIMER_THRESHOLD  = 0x07
    ###########################
    # MAX44009 Code
    ###########################
    def __init__(self, **kwargs):
        from machine import Pin, I2C
        self.i2c = I2C(scl=Pin(5), sda=Pin(4))
        self._addr = 0x4a

        
    def _read_block(self, register, size=2):
        return self.i2c.readfrom_mem(self._addr, register, size)


    def luminosity(self):
        data = self._read_block(self._REG_LUX_HIGH_BYTE, 2)
        exponent = (data[0] & 0xF0) >> 4
        mantissa = ((data[0] & 0x0F) << 4) | (data[1] & 0x0F)
        luminance = ((2 ** exponent) * mantissa) * 0.045
        return luminance
