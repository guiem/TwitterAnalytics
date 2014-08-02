"""
Script to set project filter in every db entry
"""

from settings import *
import pymongo

connection = pymongo.Connection("mongodb://{0}".format(DB_URL), safe=True)
db = connection.twitter

src_collection = eval("db.{0}".format(SRC_COLLECTION))
dest_collection = eval("db.{0}".format(DEST_COLLECTION))

total_entries = src_collection.find()
count = 1
for entry in total_entries:
	entry['twitteranalytics_project_id'] = PROJECT_ID
	dest_collection.insert(entry)
	count += 1
	print "Entry {0} of {1} transferred.".format(count,total_entries.count())
print "Total entries trasferred: {0}".format(total_entries.count())
