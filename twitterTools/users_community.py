
"""Usage: users_community.py [--pickle] -f FILE 

Options:
-f sets file name
--pickle  forces using only picke
"""

import tweepy
from settings import *
from utils import *
import pickle
from os import path
from docopt import docopt
import time
from tweepy.error import TweepError

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
  
    def _get_ids_names(self):
        res = {}
        users_gap = 100 #up to 100 screen names
        chunks = [self.users_list[x:x+users_gap] for x in xrange(0, len(self.users_list), 100)]
        users = []
        total_treated = 0
        real_treated = 0
        for chunk in chunks:
            total_treated += len(chunk)
            print 'Getting User ids. Treating chunk of len {0}. Treated {1} over {2} --> {3}. Real treated {4}'.format(len(chunk),total_treated,
                len(self.users_list),chunk,real_treated)
            limit_status = self.api.rate_limit_status()['resources']['users']['/users/lookup']
            sleep = needs_sleep(limit_status['remaining'],limit_status['reset'])
            if sleep:
                print 'Getting User ids. Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
                time.sleep(sleep)
            try:
                u_aux = self.api.lookup_users(screen_names=chunk)
                users += u_aux
                real_treated += len(u_aux)
            except:
                import traceback
                traceback.print_exc()
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

    def export_2_gephi(self):
        main_start = """
        <gexf xmlns="http://www.gexf.net/1.2draft" xmlns:viz="http://www.gexf.net/1.2draft/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd" version="1.2">
            <creator>Guiem</creator>
            <description>from TwitterAnalytics</description>
        """
        main_end = """</gexf>"""
        graph_start = """<graph mode="static" defaultedgetype="directed">"""
        graph_end = """</graph>"""
        nodes_start = """<nodes>"""
        nodes_end = """</nodes>"""
        edges_start = """<edges>"""
        edges_end = """</edges>"""
        nodes = []
        edges = []
        for u_id in self.community:
            node = """<node id="{0}" label="{1}"/>""".format(u_id,self.community[u_id]['screen_name'])
            if node not in nodes:
                nodes.append(node)
            if self.community[u_id]['friends']:
                for sub_u_id in self.community[u_id]['friends']:
                    sub_node = """<node id="{0}" label="{0}"/>""".format(sub_u_id,self.community[sub_u_id]['screen_name'])
                    if sub_node not in nodes:
                        nodes.append(sub_node)
                    edge = """<edge id="{0}-{1}" source="{0}" target="{1}"/>""".format(sub_u_id, u_id)
                    if edge not in edges:
                        edges.append(edge)   
        res = main_start+graph_start+nodes_start+('').join(nodes)+nodes_end+edges_start+('').join(edges)+edges_end+graph_end+main_end
        f = open('gephi_community.gexf','w')
        f.write(res)        
        f.close()

    def build_community(self, force_pickle = False):
        if not force_pickle:
            if not self.community or len(self.community) != len(self.users_list):
                aux_res = self._get_ids_names()
                if len(self.community) != len(users_list):
                    for u_id in aux_res.keys():
                        if u_id not in self.community.keys():
                            self.community[u_id] = aux_res[u_id]
                else:
                    self.community = aux_res
            count = 1
            for key,value in self.community.iteritems():
                print "Processing {0}'s friends list: {1} of {2}.".format(value['screen_name'],count,len(self.community))
                if not 'friends' in self.community[key].keys():
                    limit_status = self.api.rate_limit_status()['resources']['friends']['/friends/ids']
                    sleep = needs_sleep(limit_status['remaining'],limit_status['reset'])
                    if sleep:
                        print 'Sleeping {0} seconds to avoid reaching rate limit.'.format(sleep)
                        time.sleep(sleep)
                    try:
                        friends = self.api.friends_ids(value['screen_name'])
                        self.community[key]['friends'] = list(set(friends).intersection(set(self.community.keys())))
                        self._save()
                    except TweepError as e:
                        self.community[key]['friends'] = False # to avoid trying to process it again
                        f = open('users_community.log','a')
                        f.write(value['screen_name']+' ' + str(datetime.datetime.now()) + str(e)+'\n')
                        f.close()
                else:
                    print 'User already loaded from pickle.'
                count += 1
        self.export_2_gephi()
        return True

if __name__ == "__main__":
    args = docopt(__doc__)
    u = []
    if args['-f']: 
        with open(args['-f'], 'r') as f:
            for user in f.readlines():
                u.append(user.split('\n')[0])
    c = Community(api,u)
    c.build_community(args['--pickle'])

