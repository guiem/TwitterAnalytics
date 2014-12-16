import datetime

# TwitterSearch params
CONSUMER_KEY = 'YOUR CONSUMER KEY'
CONSUMER_SECRET = 'YOUR CONSUMER SECRET'
ACCESS_TOKEN = 'YOUR ACCESS TOKEN'
ACCESS_TOKEN_SECRET = 'YOUR ACCESS TOKEN SECRET'

try:
    from settings_local import *
except:
    import traceback
    traceback.print_exc()
