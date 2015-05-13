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
    tso.set_keywords(KEY_WORDS) # let's define all words we would like to have a look for
    #tso.setLanguage('es') # we want to see Spanish tweets only
    tso.set_count(100) # please dear Mr Twitter, only give us 7 results per page
    tso.set_include_entities(True)
    if UNTIL:
        tso.set_until(UNTIL)
    # it's about time to create a TwitterSearch object with our secret tokens
    ts = TwitterSearch(consumer_key = CONSUMER_KEY,consumer_secret = CONSUMER_SECRET,access_token = ACCESS_TOKEN,access_token_secret = ACCESS_TOKEN_SECRET,verify = True)
    #ts.authenticate()
    count = 0
    # connect to mongo
    connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
    db=connection.twitter
    users = db.users
    tweets = db.tweets
    new_users = 0
    response = ts.search_tweets_iterable(tso)
    for tweet in response: # this is where the fun actually starts :)
        limit_remaining = ts.get_metadata()['x-rate-limit-remaining']
        limit_reset = ts.get_metadata()['x-rate-limit-reset']
        limit = ts.get_metadata()['x-rate-limit-limit']
        sleep = needs_sleep(limit_remaining,limit_reset)
        if sleep:
            print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
            time.sleep(sleep)
        tweet['twitteranalytics_project_id'] = PROJECT_ID
        if (tweets.find({"id":tweet['id'],"twitteranalytics_project_id":PROJECT_ID}).count() == 0):
            dt = datetime.datetime.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y')
            tweet['created_at_dt'] = dt
            if (START_DATE and END_DATE and dt >= START_DATE and dt <= END_DATE) or (not (START_DATE and END_DATE)):
                tweets.insert(tweet)   
        else:
            print 'We reached our newest stored tweet: {0}'.format(tweet['text'].encode('utf-8')) 
            #break
        if users.find({"screen_name": tweet['user']['screen_name'], 'twitteranalytics_project_id':PROJECT_ID}).count() == 0:
            users.insert({"screen_name":tweet['user']['screen_name'],"processed":"no","created_at":datetime.datetime.utcnow(),
                "twitteranalytics_project_id": PROJECT_ID})
            new_users += 1
        print tweet['text'].encode('utf-8'),tweet['created_at'],count
        count += 1
    print 'Processed tweets {1}. Added {0} new users.'.format(new_users,count)

except TwitterSearchException as e: # take care of all those ugly errors if there are some
    print(e)