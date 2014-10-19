import tweepy
from settings import *
from utils import *

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

users_list = ['guiemb','rosanasj','expdem','birrabel']

class Community():
    community = {}

    def __init__(self, api):
        self.api = api
        self.community = self._get_ids_names()

    def _get_ids_names(self):
        res = {}
        users = self.api.lookup_users(screen_names=users_list)
        for u in users:
            if u.id not in res.keys():
                res[u.id] = {'screen_name':u.screen_name}
        return res

    def build_community(self):
        count = 1
        for key,value in self.community.iteritems():
            print "Processing {0}'s friends list: {1} of {2}.".format(value['screen_name'],count,len(self.community))
            limit_status = self.api.rate_limit_status()['resources']['friends']['/friends/ids']
            sleep = needs_sleep(limit_status['remaining'],limit_status['reset'])
            if sleep:
                print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
                time.sleep(sleep)
            friends = self.api.friends_ids(value['screen_name'])
            self.community[key]['friends'] = list(set(friends).intersection(set(self.community.keys())))
            count += 1
        print self.community

if __name__ == "__main__":
    Community(api).build_community()