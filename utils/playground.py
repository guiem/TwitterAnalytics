""" Playground to Test several features of the TwitterAnalytics project

Usage: 
    playground.py (dumpdb|restoredb) --path PATH
    playground.py checkhashtags [--nhs=<hs>]
    playground.py listhashtags --path PATH [--nhl=<n>]
    playground.py hashtagsgraph --path PATH [--nhl=<n>]
    playground.py (-h | --help) 

Options:
    -h --help    Show this screen.
    --path PAHT  Specify absolute output path in dump, src FILEPATH in restore.
    --nhs=<hs>   Num tweets with hashtag [default: 5].
    --nhl=<nl>   Num hashtags to list [default: all].
"""
from docopt import docopt
from twitter import *
from settings import *
import pymongo
import datetime
import time
from collections import OrderedDict

class DBConnection():
    def __init__(self):
        self.connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
        self.db = self.connection.twitter
        self.tweets = self.db.tweets
        self.hashtags = self.db.hashtags

def checkhashtags(num_hashtags):
    nhs = int(num_hashtags)
    db_con = DBConnection()
    tweets_hash = 0
    for tweet in db_con.tweets.find({"twitteranalytics_project_id":PROJECT_ID}):
        if 'entities' in tweet.keys() and tweet['entities']:
            if tweet['entities']['hashtags']:
                tweets_hash += 1
                print '------------------------------------------------------------'
            for entity in tweet['entities']['hashtags']:
                entity = entity['text'].encode('utf-8')
                print 'HASH:',entity,'|','TWEET:',tweet['text'].encode('utf-8')
        if tweets_hash == nhs:
            break

def _get_hashtags_users(num_hashtags):
    nhs = int(num_hashtags) if num_hashtags != 'all' else 'all'
    db_con = DBConnection()
    num_hash = 1
    res = OrderedDict()
    for hash in db_con.hashtags.find({"twitteranalytics_project_id":'guiem_df'}).sort('count',-1):
        res[hash['hashtag'].encode('utf-8')] = {'count':hash['count'],'users':hash['users']}
        if nhs != 'all' and num_hash == nhs:
            break
        num_hash += 1
    return res

def hashtagsgraph(num_hashtags, filepath):
    hash_dict = _get_hashtags_users(num_hashtags)
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
    hashes = hash_dict.keys()
    for hash in hash_dict:
        node = """<node id="{0}" label="{0}"><viz:color r="239" g="173" b="66" a="0.6"/></node>""".format('#'+hash)
        if node not in nodes:
            nodes.append(node)
        for user in hash_dict[hash]['users']:
            sub_node = """<node id="{0}" label="{0}"/>""".format(user)
            if sub_node not in nodes:
                nodes.append(sub_node)
            edge = """<edge id="{0}-{1}" source="{0}" target="{1}"/>""".format(user,'#'+hash)
            if edge not in edges:
                edges.append(edge)   
    res = main_start+graph_start+nodes_start+('').join(nodes)+nodes_end+edges_start+('').join(edges)+edges_end+graph_end+main_end
    f = open(filepath,'w')
    f.write(res)        
    f.close()

def listhashtags(num_hashtags, filepath):
    hash_dict = _get_hashtags_users(num_hashtags)
    f = open(filepath,'w')
    res = 'HASHTAG;NUM.;USUARIOS\n'
    for hash in hash_dict:
        res += '{0};{1};{2}\n'.format(hash,hash_dict[hash]['count'],(' , ').join(hash_dict[hash]['users']))
    f.write(res)        
    f.close()
        
def dumpdb(path):
    print 'Dumping database...'
    os.system('mongodump --db twitter')
    print 'Dump finished.'
    print 'Compressing dump file...'
    deploy_date = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    file_name = '{0}.twitter.tar.gz'.format(deploy_date)
    os.system('tar -zcvf {0} dump'.format(file_name))
    print 'Compression finished.'
    print 'Cleaning dump...'
    os.system('rm -rf dump')
    print 'Moving dump to PATH'
    os.system('mv {0} {1}'.format(file_name,path))

def restoredb(filepath):
    print 'Uncompressing file'
    os.system('tar -zxvf {0}'.format(filepath))
    print 'Cleaning DB'
    os.system('mongo twitter --eval "db.dropDatabase()"') # remove first the database because mongorestore only makes inserts
    print 'Restoring DB'
    os.system('mongorestore --db twitter dump/twitter')
    print 'Cleaning remaining dump'
    os.system('rm -rf dump')

if __name__ == "__main__":
    arguments = docopt(__doc__)
    if arguments['dumpdb']:
        dumpdb(arguments['--path'])
    elif arguments['restoredb']:
        restoredb(arguments['--path'])
    elif arguments['checkhashtags']:
        checkhashtags(arguments['--nhs'])
    elif arguments['listhashtags']:
        listhashtags(arguments['--nhl'],arguments['--path'])
    elif arguments['hashtagsgraph']:
        hashtagsgraph(arguments['--nhl'],arguments['--path'])


