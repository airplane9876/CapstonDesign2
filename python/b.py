import sys
import random
import json

D = [
    { 'classNum': 3}, 
    { 'classNum': 2 }, 
    { 'classNum': 1 }, 
    { 'classNum': 0 }, 
]

def functionTest(img):
    i = random.randrange(0, 101)%10
    if (i < 2):
        print (json.dumps(D[i:i+1]))
    elif(i < 4):
        print (json.dumps(D[2:4]))


if __name__ == '__main__':
    N = input()
    functionTest(N)
