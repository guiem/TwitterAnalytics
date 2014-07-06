from twitter import *
from settings import *
from utils import *
import pymongo
import datetime
import time
import nltk

# connect to mongo
connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db=connection.twitter
users = db.users


users_processed = 0
f = open('users_list.txt','w')
users_list = []
for user in users.find():
    users_list.append(user['screen_name'])
    users_processed += 1
    print 'Processed {0}, num_users {1}'.format(user['screen_name'], users_processed)
f.write(('\n').join(users_list))
