import sys
import random
import json

arr = []

def functionTest(img):
    x, y = random.randrange(0, 500), random.randrange(0, 500)
    if x < 32:
        arr.append(x)
    if y < 32:
        arr.append(y)
    print(arr)


if __name__ == '__main__':
    N = input()
    functionTest(N)
