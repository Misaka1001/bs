#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from machine import ADC

adc = ADC(0)

def getValue():
    result = adc.read()
    Lp = result / 10 + 30
    return Lp
