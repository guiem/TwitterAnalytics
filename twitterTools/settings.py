import datetime

# TwitterSearch params
CONSUMER_KEY = 'YOUR CONSUMER KEY'
CONSUMER_SECRET = 'YOUR CONSUMER SECRET'
ACCESS_TOKEN = 'YOUR ACCESS TOKEN'
ACCESS_TOKEN_SECRET = 'YOUR ACCESS TOKEN SECRET'
KEY_WORDS = ['word1','word2','wordN'] # check this URL to properly configure your Twitter search https://dev.twitter.com/docs/using-search (ie. exact phrase by using "exact phrase example" and combining it with OR expressions...)
UNTIL = False # set a datetime to filter tweets until the day you indicate

# TwitterTimeline params
TIMELINE_COUNT = 200
TIMELINE_KEYWORDS = ['word1','word2'] # but not expresions with OR
UPDATE_GAP_SECONDS = 12*60*60 # users that have been processed in the GAP in seconds won't be processed now
BLACK_LIST = []
UPDATE_ALL = False # set true if you want a shotcurt and update all since_id from all time
START_DATE = False # careful because it takes UTC times
END_DATE = False
EXCLUDE_REPLIES = True

# DATABASE
DB_URL = 'localhost'
TWEETS_SUFIX = '_whatever' # if you collect tweets by term 'whatever' you'll find your tweets in the database stored in a collection called tweets_whatever
USERS_SUFIX = '_whatever'
WORDS_SUFIX = '_whatever'
HASHTAGS_SUFIX = '_whatever'

USERS_FILE_PATH = 'None'

try:
    from settings_local import *
except:
    import traceback
    print traceback.print_exc()
