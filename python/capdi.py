import base64
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
from keras.models import load_model
import numpy as np
import os
import cv2
import sys

images=[]
cnt = 0
model=load_model('python/over_256_small_22_4.h5')

if __name__=='__main__':
    
    while(True):
        image=input()
        images.append(cv2.resize(np.array(Image.open(BytesIO(base64.b64decode(image)))), dsize=(112, 112))[:,:,:3])
        if len(images) == 15:
            # pred=model.predict(np.expand_dims(np.array(images),axis=0))
            # print(pred[0,0])
            pred=model(np.expand_dims(np.array(images),axis=0), training=True)
            print(pred[0, 0].numpy())
            images=images[1:]

