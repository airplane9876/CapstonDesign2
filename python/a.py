import sys
import random
import base64
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
from keras.models import load_model
import numpy as np
import os
import cv2

def functionTest(img):
    print (random.randrange(0, 101))

if __name__ == '__main__':
    while True:
        N = input()
        b = input()
        print(N, b, random.randrange(0, 101))
    # functionTest(N)
