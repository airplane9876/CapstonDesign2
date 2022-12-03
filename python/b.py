import sys
import random
import json

arr = []

def functionTest(img):
    global arr
    x, y = random.randrange(0, 500), random.randrange(0, 500)
    if x < 32:
        arr.append(x)
    if y < 32:
        arr.append(y)
    print(arr)
    arr = []


if __name__ == '__main__':
    while True:
        N = input()
        functionTest(N)
