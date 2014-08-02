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

def get_timeline(screen_name, since_id = False):
    try:
        if screen_name in BLACK_LIST:
            print "Skipping user {0} because it's black listed".format(screen_name)
            return False
        response = None
        if not since_id:
            response = t.statuses.user_timeline(screen_name=screen_name,count=TIMELINE_COUNT,exclude_replies=EXCLUDE_REPLIES,include_rts=INCLUDE_RTS)
        else:
            response = t.statuses.user_timeline(screen_name=screen_name,count=TIMELINE_COUNT,since_id = since_id, exclude_replies=EXCLUDE_REPLIES,include_rts=INCLUDE_RTS)
        count = 0
        next_max_id = 0
        todo = True
        new_since_id = 0
        while todo:
            todo = not (len(response) < TIMELINE_COUNT)
            for tweet in response:
                tweet_id = tweet['id']
                tweet['twitteranalytics_project_id'] = PROJECT_ID
                if (not TIMELINE_KEYWORDS or contains_keywords(tweet['text'].encode('utf-8'))) and tweets.find({"id":tweet['id'] }).count() == 0:
                    dt = datetime.datetime.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y')
                    tweet['created_at_dt'] = dt
                    #import pdb
                    #pdb.set_trace()
                    if (START_DATE and END_DATE and dt >= START_DATE and dt <= END_DATE) or (not (START_DATE and END_DATE)):
                        tweets.insert(tweet)
                    if START_DATE and dt < START_DATE:
                        todo = False
                count += 1
                if (tweet_id < next_max_id) or (next_max_id == 0):
                    next_max_id = tweet_id
                    next_max_id -= 1 # decrement to avoid seeing this tweet again
                new_since_id = max(new_since_id,tweet_id)
            if not since_id:
                response = t.statuses.user_timeline(screen_name=screen_name,count=TIMELINE_COUNT,max_id = next_max_id, exclude_replies=EXCLUDE_REPLIES,include_rts=INCLUDE_RTS)
            else:
                response = t.statuses.user_timeline(screen_name=screen_name,count=TIMELINE_COUNT,max_id = next_max_id, since_id = since_id, exclude_replies=EXCLUDE_REPLIES,include_rts=INCLUDE_RTS)
            sleep = needs_sleep(response.rate_limit_remaining,response.rate_limit_reset)
            print "screen_name: {0} | count: {1} | limit remaining: {2} | limit reset {3}".format(screen_name,count,response.rate_limit_remaining, response.rate_limit_reset)
            if sleep:
                print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
                time.sleep(sleep)
        return new_since_id
    except Exception,e:
        import traceback
        print str(e),traceback.format_exc()

users_processed = 0
users_updated = 0
users_to_process = users.find()
total_users = users_to_process.count()
count = 0
for user in users_to_process:
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
    count += 1
    print "{0}/{1} visited users".format(count,total_users)
print 'Total users processed {0}. Users updated: {1}'.format(users_processed, users_updated)

