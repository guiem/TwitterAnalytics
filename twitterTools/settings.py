import datetime

PROJECT_ID = 'your project id here'

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

USERS_FILE_PATH = 'None'
DB_URL = 'localhost'

try:
    from settings_local import *
except:
    import traceback
    traceback.print_exc()
