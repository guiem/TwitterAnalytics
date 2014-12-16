import kivy
kivy.require('1.0.5')

from kivy.uix.floatlayout import FloatLayout
from kivy.app import App
from kivy.properties import ObjectProperty, StringProperty
import tweepy
from settings import *
from twitterTools.stream_listener import CustomStreamListener


class Controller(FloatLayout):
    '''Create a controller that receives a custom widget from the kv lang file.

    Add an action to be called from the kv lang file.
    '''
    label_wid = ObjectProperty()
    info = StringProperty()

    def do_action(self):
        if self.ids["btn_start"].text == 'Start':
            self.ids["btn_start"].text = 'Stop'
            auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
            auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
            api = tweepy.API(auth)
            project_id = self.ids["project_input"].text.replace(' ','_')
            url = "http://localhost:8085/projects?projectId={0}".format(project_id)  
            self.ids["project_output"].text = url          
            sapi = tweepy.streaming.Stream(auth, CustomStreamListener(api,project_id = project_id))
            print sapi.filter(track=self.ids["search_terms"].text.split(')'))
        else:
            self.ids["btn_start"].text = 'Start'
        self.info = 'New info text'


class ControllerApp(App):

    def build(self):
        return Controller(info='Twitter Streaming API')

if __name__ == '__main__':
    ControllerApp().run()
