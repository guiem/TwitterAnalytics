
"""Usage: users_community.py -f FILE

Options:
    -f sets file name
"""

import tweepy
from settings import *
from utils import *
import pickle
from os import path
from docopt import docopt

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

class Community():
    community = False
    users_list = False
    #users_list = ['guiemb','rosanasj','expdem','birrabel']

    def __init__(self, api, users_list):
        self.api = api
        self.users_list = users_list 
        self.community = self._load()
        if not self.community:
            self.community = self._get_ids_names()

    def _get_ids_names(self):
        res = {}
        users = self.api.lookup_users(screen_names=self.users_list)
        for u in users:
            if u.id not in res.keys():
                res[u.id] = {'screen_name':u.screen_name}
        return res

    def _save(self):
        print "Saving users info."
        with open(PICKLE_NAME+'.pickle', 'w') as f:
            pickle.dump(self.community, f)

    def _load(self):
        if path.exists(PICKLE_NAME+'.pickle'):
            print "Loading user's info." 
            with open(PICKLE_NAME+'.pickle', 'r') as pfile:
                return pickle.load(pfile)
        else:
            return False

    def build_community(self):
        count = 1
        for key,value in self.community.iteritems():
            print "Processing {0}'s friends list: {1} of {2}.".format(value['screen_name'],count,len(self.community))
            if not 'friends' in self.community[key].keys():
                limit_status = self.api.rate_limit_status()['resources']['friends']['/friends/ids']
                sleep = needs_sleep(limit_status['remaining'],limit_status['reset'])
                if sleep:
                    print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
                    time.sleep(sleep)
                friends = self.api.friends_ids(value['screen_name'])
                self.community[key]['friends'] = list(set(friends).intersection(set(self.community.keys())))
                self._save()
            else:
                print 'User already loaded from pickle.'
            count += 1
        print self.community

if __name__ == "__main__":
    args = docopt(__doc__)
    u = []
    if args['-f']: 
        with open(args['-f'], 'r') as f:
            for user in f.readlines():
                u.append(user.split('\n')[0])
    c = Community(api,u)
    c.build_community()