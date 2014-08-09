import json
import pymongo
import tweepy
import datetime
from settings import *

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

class CustomStreamListener(tweepy.StreamListener):
    def __init__(self, api):
        self.api = api
        super(tweepy.StreamListener, self).__init__()
        self.db = pymongo.MongoClient().twitter

    def on_data(self, tweet):
        jtweet = json.loads(tweet)
        tweet_text = jtweet.get('text')
        if tweet_text:
            jtweet['text'] = tweet_text.encode('utf-8')
            jtweet['twitteranalytics_project_id'] = PROJECT_ID
            dt = datetime.datetime.strptime(jtweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y')
            jtweet['created_at_dt'] = dt
            print jtweet['text']
            self.db.tweets.insert(jtweet)
        else:
            pass
            # right now we don't store tweets with no text

    def on_error(self, status_code):
        return True # Don't kill the stream

    def on_timeout(self):
        return True # Don't kill the stream


sapi = tweepy.streaming.Stream(auth, CustomStreamListener(api))
sapi.filter(track=['bonan','tago','gxis','ghix','saluton','esperanto','tamen','kvankam','bedaurinde','facte','nekredeble','dankon','Dankon'])
#sapi.firehose()

"""Returns a small random sample of all public statuses. The Tweets returned by the default access level are the same, 
so if two different clients connect to this endpoint, they will see the same Tweets."""
#sapi.sample() 