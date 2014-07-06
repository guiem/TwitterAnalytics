from twitter import *
from settings import *
from utils import *
import pymongo
import datetime
import time

# connect to mongo
connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db=connection.twitter
users = eval("db.users{0}".format(USERS_SUFIX))

users_processed = 0
f = open(USERS_FILE_PATH)
for l in f.readlines():
    users.insert({"screen_name":l.split('\n')[0],"created_at":datetime.datetime.utcnow(),'processed':'no'})
    users_processed += 1
print """Total users: {0}""".format(users_processed)

