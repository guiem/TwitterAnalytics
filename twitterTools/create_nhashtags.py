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
tweets = eval("db.tweets{0}".format(TWEETS_SUFIX))
db.drop_collection("hashtags{0}".format(WORDS_SUFIX))
hashtags = eval("db.hashtags{0}".format(HASHTAGS_SUFIX))

tweets_processed = 0
res = {}
for tweet in tweets.find():
    hashtag_list = [word for word in tweet['text'].split() if word.startswith('#')]
    for h in hashtag_list:
        if h.lower() not in res.keys():
            res[h.lower()] = 1
        else:
            res[h.lower()] += 1
    tweets_processed += 1
    print """Total: {0}""".format(tweets_processed)
hashtags_db = 0
for k in res.keys():
    hashtags.insert({"hashtag":k,"count":res[k]})
    hashtags_db += 1
    print """Total hashtags db: {0}""".format(hashtags_db)

