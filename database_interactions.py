import datetime
import firebase_admin
from firebase_admin import credentials, db
from pyfcm import FCMNotification

push_service = FCMNotification(api_key='AAAArW3PuMs:APA91bFjoq3DKRuw9DKPQekgM9rNuCAfPCyJr2dKeXtm0pp1EY9fYGLo1M-H7_hp5dt6gpdacczr-HnarjPcyF8QvGJtGSN4HcSXK4sNv4SGEStutj_69Fe3z0uMurSIUeIDfSGyJxyp')

#Firebase Initialization
cred = credentials.Certificate('static/cubetastic-f5f7e-firebase-adminsdk-m94n9-cba250f5b1.json')
default_app = firebase_admin.initialize_app(cred, {
  'databaseURL': 'https://cubetastic-f5f7e.firebaseio.com'
})

def create_user(uid, email, location, phone, username, profilePic='/images/defaultProfilePic.png'):
  db.reference('users').child(uid).set({
    'email': str(email),
    'location': str(location),
    'phone': str(phone),
    'profilePic': str(profilePic),
    'username': str(username)
  })
  return 'created user ' + str(username) + '.'

def send_feedback(title, message):
    feedback_ref = db.reference('/feedback')
    feedback_ref.push({
        'title': str(title),
        'message': str(message)
    })
    return 'Done!'

def send_chat_message(uid, group, message):
    db.reference('/chat/' + str(group)).push({
        'author': str(uid),
        'message': str(message),
        'time': str(datetime.datetime.now().time()) + ',' + str(datetime.datetime.now().date())
    })
    notifyUsersInGroup(uid, group, message)
    return 'Success'

def notifyUsersInGroup(uid, requiredGroup, message):
  fcmTokens = db.reference('fcmTokens').get()
  username = db.reference('users/'+uid+'/username').get()
  profilePic = db.reference('users/'+uid+'/profilePic').get()
  users = db.reference('users').get()
  for user in users:
    if users[user]['username'] != username:
      try:
        for group in users[user]['chat_groups']:
          print('crossed checkpoint 1', group)
          if group == requiredGroup:
            for fcmToken, fcmTokenUid in fcmTokens.items():
              if fcmTokenUid == user:
                print('crossed checkpoint 2', message)
                message_title = str(username) + ' has sent a message'
                if len(message) > 50:
                  message = str(message[0:50]) + '...'
                push_service.notify_single_device(registration_id=fcmToken, message_title=message_title, message_body=message, message_icon=profilePic)
                print('Notified ' + str(user))
      except Exception as e:
        print('Error '+ str(e))
