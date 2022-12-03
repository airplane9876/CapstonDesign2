import base64
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
from keras.models import load_model
import numpy as np
import os
import cv2
import sys

print("READY")

images=[]
cnt = 0
model=load_model('python/data_loader_acci_pred3_7.h5')
if __name__=='__main__':
    
    while(True):
        image=input()
        images.append(cv2.resize(np.array(Image.open(BytesIO(base64.b64decode(image)))), dsize=(256, 187))[:,:,:3])
        
        if len(images) == 30:            
            pred=model.predict(np.expand_dims(np.array(images),axis=0))
            print(pred[0,0])
            images=images[1:]

