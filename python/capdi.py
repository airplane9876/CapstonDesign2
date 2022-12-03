import base64
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
from keras.models import load_model
import numpy as np
import os
import cv2
import sys


cnt = 0
if __name__=='__main__':
    
    image=input().split(',')
    images = []
    for i in image: 
        images.append(cv2.resize(np.array(Image.open(BytesIO(base64.b64decode(i)))), dsize=(256, 187))[:,:,:3])

    # images.append(cv2.resize(np.array(Image.open(BytesIO(base64.b64decode(image)))), dsize=(256, 187))[:,:,:3])
    
    # if len(images) == 30:
    model=load_model('python/fin_acci_pred4_5_67.h5')
    # print(np.expand_dims(np.array(images),axis=0))
    pred=model.predict(np.expand_dims(np.array(images),axis=0))
    print(pred[0,0])

