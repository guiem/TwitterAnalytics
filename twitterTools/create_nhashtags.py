from twitter import *
from settings import *
from utils import *
import pymongo
import datetime
import time

# connect to mongo
connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db=connection.twitter
tweets = db.tweets
#db.drop_collection(db.hashtags)
db.hashtags.remove({'twitteranalytics_project_id':PROJECT_ID})
hashtags = db.hashtags

tweets_processed = 0
res = {}
for tweet in tweets.find({"twitteranalytics_project_id":PROJECT_ID}):
    if 'entities' in tweet.keys() and tweet['entities']:
        user = tweet['user']['screen_name']
        for entity in tweet['entities']['hashtags']:
            entity = entity['text'].encode('utf-8')
            if entity not in res:
                res[entity.lower()] = {'count':0,'users':[user]}
            res[entity.lower()]['count'] += 1
            if user not in res[entity.lower()]['users']:
                res[entity.lower()]['users'].append(user)    
    tweets_processed += 1
    print """Total: {0}""".format(tweets_processed)
hashtags_db = 0
for i,k in enumerate(res):
    hashtags.insert({"hashtag":k,"count":res[k]['count'],'users':res[k]['users'],"twitteranalytics_project_id": PROJECT_ID})
    print """Total hashtags db: {0}""".format(i+1)

