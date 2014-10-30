""" Playground to Test several features of the TwitterAnalytics project

Usage: 
    playground.py (dumpdb|restoredb) --path PATH
    playground.py checkhashtags [--nhs=<hs>]
    playground.py (-h | --help) 

Options:
    -h --help    Show this screen.
    --path PAHT  Specify absolute output path in dump, src FILEPATH in restore.
    --nhs=<hs> Num tweets with hashtag [default: 5].

"""
from docopt import docopt
from twitter import *
from settings import *
import pymongo
import datetime
import time

def checkhashtags(num_hashtags):
    nhs = int(num_hashtags) if num_hashtags else 5
    connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
    db=connection.twitter
    tweets = db.tweets
    tweets_hash = 0
    for tweet in tweets.find({"twitteranalytics_project_id":PROJECT_ID}):
        if 'entities' in tweet.keys() and tweet['entities']:
            if tweet['entities']['hashtags']:
                tweets_hash += 1
                print '------------------------------------------------------------'
            for entity in tweet['entities']['hashtags']:
                entity = entity['text'].encode('utf-8')
                print 'HASH:',entity,'|','TWEET:',tweet['text'].encode('utf-8')
        if tweets_hash == nhs:
            break
        
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


