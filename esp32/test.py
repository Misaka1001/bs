#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import getlp
import getlum
import time
lp = getlp.GetLp().get_value
lum = getlum.GetLum().get_value
i = 0
while True:
    i += 1
    data = {
        'lp': lp(),
        'lum': lum()
    }
    if data['lp'] == False or data['lum'] == False:
        time.sleep(1)
        continue
    print('第'+ str(i) +'次测量, 噪声为' + str(data['lp']) + 'dB, 光照为' + str(data['lum']) + 'lx')
    time.sleep(1)
