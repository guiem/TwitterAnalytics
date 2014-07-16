from settings import *
import os
import datetime

if UPDATE_WORD_CLOUD:
	print 'Updating Word Cloud...'
	os.system('python ../twitterTools/create_ngrams.py')
	print 'Word Cloud updated.'
if UPDATE_HASHTAGS:
	print 'Updating Hashtags...'
	os.system('python ../twitterTools/create_nhashtags.py')
	print 'Hashtags updated.'
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
if UPDATE_DB:
	print 'Sending file to remote server...'
	os.system('fab -f fab_deploy -H {0} --port={1} -u {2} send_file:"{3}","{4}"'.format(HOST,PORT,USERNAME,file_name, DEST_PATH))
	print 'File sent.'
print 'Cleaning local compressed file...'
os.system('rm -rf {0}'.format(file_name))
if UPDATE_SRC:
	print 'Updating code from git...'
	os.system('fab -f fab_deploy -H {0} --port={1} -u {2} update_src:"{3}","{4}"'.format(HOST,PORT,USERNAME,SRC_PATH,GIT_USER))
	print 'Code update done.'
print 'Updating db...'
os.system('fab -f fab_deploy -H {0} --port={1} -u {2} update_db:"{3}","{4}"'.format(HOST,PORT,USERNAME,file_name,DEST_PATH))
print 'End of db update.'
print 'Thats all folks!'