from fabric.api import run,put,cd,sudo
from settings import *

def send_file(file_name, dest_path):
	put(file_name, dest_path)

# TODO: git user identification not working 
def update_src(directory,git_user):
	with cd(directory):
		run('git pull')

def update_db(file_name,dest_path):
	with cd(dest_path):
		run('tar -zxvf {0}'.format(file_name))
		sudo('mongo twitter --eval "db.dropDatabase()" --port {0}'.format(MONGO_PORT)) # remove first the database because mongorestore only makes inserts
		run('mongorestore --port {0} --db twitter dump/twitter'.format(MONGO_PORT))
		run('rm -rf dump')

