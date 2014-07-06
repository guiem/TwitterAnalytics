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
db.drop_collection("words{0}".format(WORDS_SUFIX))
words = eval("db.words{0}".format(WORDS_SUFIX))

"""tweets_processed = 0
for tweet in tweets.find({ngrammed:None}):
    w_list = tweet['text'].encode('utf-8').split(' ')
    for w in w_list:
        if words.find({word:w.lower()}).count() == 0:
            words.insert({word:w.lower(),count:1})
        else:
            words.update({word:w.lower()},{ "$inc": { count: 1 }})
    tweets.update({"id": tweet['id']}, {"$set": {"ngrammed": "yes"}})
    tweets_processed += 1
    print "{0}'s tweet been processed. Total: {1}".format(tweet['user.screen_name'], tweets_processed)"""

tweets_processed = 0
res = {}
for tweet in tweets.find():
    w_list = nltk.word_tokenize(tweet['text'])
    for w in w_list:
        if w.lower() not in res.keys():
            res[w.lower()] = 1
        else:
            res[w.lower()] += 1
    tweets_processed += 1
    print """Total: {0}""".format(tweets_processed)
words_db = 0
for k in res.keys():
    words.insert({"word":k,"count":res[k]})
    words_db += 1
    print """Total words db: {0}""".format(words_db)

