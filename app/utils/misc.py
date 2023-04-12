# import numpy as np
# from scipy.spatial import KDTree
# N   = 20
# pts = 2500*np.random.random((N,2))

# tree = KDTree(pts)
# print(tree.sparse_distance_matrix(tree, 200))

import random
import string

def get_random_string():
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    rand_num = ''.join(random.choice(string.digits) for i in range(4))
    rand_str = ''.join(random.choice(string.ascii_uppercase) for i in range(3))
    result_str = rand_num + rand_str
    print("Random string of length", 7, "is:", result_str)
    return result_str