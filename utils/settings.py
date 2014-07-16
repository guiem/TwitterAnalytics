USERNAME = 'your username'
PORT = '22' # typically 22, but you might want to change it
HOST = 'your host'
DEST_PATH = '/remote_path/where/to/put/db_dump'
UPDATE_WORD_CLOUD = False
UPDATE_HASHTAGS = False
UPDATE_DB = True
UPDATE_SRC = False # True if you want to download git's repository last version
SRC_PATH = '/path/to/remote/server/src'
GIT_USER = 'git user email only if you plan to update git code'

try:
    from settings_local import *
except:
    import traceback
    print traceback.print_exc()