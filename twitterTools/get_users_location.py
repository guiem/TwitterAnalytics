from twitter import *
from settings import *
from utils import *
import pymongo
import datetime
import time

# user timeline https://dev.twitter.com/docs/api/1/get/statuses/user_timeline

def contains_keywords(tweet_text):
    for combo in TIMELINE_KEYWORDS:
        if combo in tweet_text:
            return True
    return False

t = Twitter(
            auth=OAuth(ACCESS_TOKEN, ACCESS_TOKEN_SECRET,
                       CONSUMER_KEY, CONSUMER_SECRET)
            )

# connect to mongo
connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db=connection.twitter
tweets = db.tweets
users = db.users

from twython import Twython
twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET,ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
print twitter.show_user(screen_name='discalibros')['location']
"""
users_processed = 0
users_updated = 0
for user in users.find():
    if not UPDATE_ALL and (user['processed'] != 'no' and user['processed'] > (datetime.datetime.utcnow() -  datetime.timedelta(seconds=UPDATE_GAP_SECONDS))): # if user has been processed in the past GAP seconds we do nothing
        print 'Skipping user {0}'.format(user['screen_name'])
    else:
        if 'since_id' in user.keys():
            users_updated += 1
        since_id = get_timeline(user['screen_name'], since_id = not UPDATE_ALL and ('since_id' in user.keys() and user['since_id']))
        if since_id:
            users.update({"screen_name": user['screen_name']}, {"$set": {"processed": datetime.datetime.utcnow(),"since_id":since_id}})
        else:
            users.update({"screen_name": user['screen_name']}, {"$set": {"processed": datetime.datetime.utcnow()}})
        users_processed += 1
        print "{0}'s timline has been processed".format(user['screen_name'])
print 'Total users processed {0}. Users updated: {1}'.format(users_processed, users_updated)
"""

