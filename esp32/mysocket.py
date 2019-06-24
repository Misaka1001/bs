#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import socket
import json
class MySocket:
    """
    与服务器建立socket连接
    提供发送数据方法
    """
    def __init__(self, host, port):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print('Start Connection')
        print('ip: '+'host ','port: '+str(port))
        self.socket.connect((host, port))
        print('Connection Successful')
    def send_message(self, data):
        data = json.dumps(data)
        print('send_message：' + data)
        self.socket.send(data + '/')
        return True
