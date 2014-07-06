from twitter import *
from settings import *
from utils import *
import pymongo
import datetime
import time

# connect to mongo
connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db=connection.twitter
tweets = eval("db.tweets{0}".format(TWEETS_SUFIX))

tweets_processed = 0
res = {}
for tweet in tweets.find():
    dt = datetime.datetime.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y')
    tweets.update({"_id": tweet['_id']}, {"$set": {"created_at_dt": dt}})
    tweets_processed += 1
    print """Total: {0}""".format(tweets_processed)
