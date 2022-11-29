import sys
import random

D = [
    { 'header': 'warning', 'class': '어린이보호', 'classNum': 3}, 
    { 'header': 'danger', 'class': 'Red Light', 'classNum': 2 }, 
    { 'header': 'danger', 'class': '유턴 금지', 'classNum': 1 }, 
    { 'header': 'warning', 'class': 'Yello Light', 'classNum': 0 }, 
]

def functionTest(img):
    i = random.randrange(0, 101)%10
    if (i < 4):
        print (D[i])
    else:
        print('')


if __name__ == '__main__':
    N = input()
    functionTest(N)
