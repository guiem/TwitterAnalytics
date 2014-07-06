from twitter import *
from settings import *

auth=OAuth(ACCESS_TOKEN, ACCESS_TOKEN_SECRET,CONSUMER_KEY, CONSUMER_SECRET)
twitter_userstream = TwitterStream(auth=auth,follow=['guiemb'],domain='userstream.twitter.com')
for msg in twitter_userstream.user():
    if 'direct_message' in msg:
        print msg['direct_message']['text']                        
