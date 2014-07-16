from fabric.api import run,put,cd,sudo

def send_file(file_name, dest_path):
	put(file_name, dest_path)

# TODO: git user identification not working 
def update_src(directory,git_user):
	with cd(directory):
		run('git pull')

def update_db(file_name,dest_path):
	with cd(dest_path):
		run('tar -zxvf {0}'.format(file_name))
		sudo('mongo twitter --eval "db.dropDatabase()"') # remove first the database because mongorestore only makes inserts
		run('mongorestore --db twitter dump/twitter')
		run('rm -rf dump')

