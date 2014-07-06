# -*- coding: utf-8 -*-
import operator
from settings import *
from TwitterSearch import *
import json
import pymongo
import datetime
import time
from utils import *

# twitter objects https://dev.twitter.com/docs/platform-objects/tweets
# twitter rate limit https://dev.twitter.com/docs/rate-limiting/1.1

try:
    tso = TwitterSearchOrder() # create a TwitterSearchOrder object
    tso.setKeywords(KEY_WORDS) # let's define all words we would like to have a look for
    #tso.setLanguage('es') # we want to see Spanish tweets only
    tso.setCount(100) # please dear Mr Twitter, only give us 7 results per page
    tso.setIncludeEntities(True)
    if UNTIL:
        tso.setUntil(UNTIL)
    # it's about time to create a TwitterSearch object with our secret tokens
    ts = TwitterSearch(consumer_key = CONSUMER_KEY,consumer_secret = CONSUMER_SECRET,access_token = ACCESS_TOKEN,access_token_secret = ACCESS_TOKEN_SECRET,verify = True)
    #ts.authenticate()
    count = 0
    # connect to mongo
    connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
    db=connection.twitter
    users = eval("db.users{0}".format(USERS_SUFIX))
    new_users = 0
    response = ts.searchTweetsIterable(tso)
    for tweet in response: # this is where the fun actually starts :)
        limit_remaining = ts.getMetadata()['x-rate-limit-remaining']
        limit_reset = ts.getMetadata()['x-rate-limit-reset']
        limit = ts.getMetadata()['x-rate-limit-limit']
        sleep = needs_sleep(limit_remaining,limit_reset)
        if sleep:
            print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
            time.sleep(sleep)
        #tweets.insert(tweet)
        if users.find({"screen_name": tweet['user']['screen_name']}).count() == 0:
            users.insert({"screen_name":tweet['user']['screen_name'],"processed":"no","created_at":datetime.datetime.utcnow()})
            new_users += 1
        print tweet['user']['screen_name'],tweet['created_at'],count
        count += 1
    print 'Added {0} new users.'.format(new_users)

except TwitterSearchException as e: # take care of all those ugly errors if there are some
    print(e)