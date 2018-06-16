import datetime
import firebase_admin
from firebase_admin import credentials, auth, db
from pyfcm import FCMNotification

push_service = FCMNotification(api_key='api_key')

#Firebase Initialization
cred = credentials.Certificate('static/certificate.json')
default_app = firebase_admin.initialize_app(cred, {
  'databaseURL': 'databaseURL'
})

def create_user(uid, email, location, phone, username, profilePic):
  db.reference('users').child(uid).set({
    'email': str(email),
    'location': str(location),
    'phone': str(phone),
    'profilePic': str(profilePic),
    'username': str(username)
  })
  return 'created user ' + str(username) + '.'

def user_exists(uid, username):
  users = db.reference('users').get()
  usernameExists = []
  uidExists = []
  for user in users:
    usernameExists.append(users[user]['username'] == username)
    uidExists.append(user)
  usernameExists = True in usernameExists
  return {'name': str(usernameExists), 'uid': uidExists}

def username_exists(username):
  users = db.reference('users').get()
  usernameExists = []
  for user in users:
    usernameExists.append(users[user]['username'] == username)
  return 'True' if True in usernameExists else 'False'

def get_email(username):
  users = db.reference('users').get()
  for user in users:
    #Check if username = user's username
    if users[user]['username'] == username:
      return users[user]['email']

def send_feedback(title, message):
    feedback_ref = db.reference('/feedback')
    feedback_ref.push({
      'title': title,
      'message': message
    })
    return 'Done!'

def save_time(uid, time, session, scramble, category, plus_two, solve_date):
  db.reference('times/'+str(uid)).child('session'+str(session)).push({
    'time': str(time),
    'scramble': scramble,
    'category': category,
    'plusTwo': plus_two,
    'solveDate': solve_date
  })
  return 'saved time'

def plus_two_solve(uid, session, key, plus_two):
  db.reference('times/'+str(uid)+'/session'+str(session)+'/'+str(key)).child('plusTwo').set(plus_two)
  return plus_two

def dnf_solve(uid, session, key):
  db.reference('times/'+str(uid)+'/session'+str(session)+'/'+str(key)).child('plusTwo').set('DNF')
  return 'Successfully set solve as DNF'

def delete_solve(uid, session, key):
  if db.reference('times/'+str(uid)+'/session'+str(session)).child(str(key)).get() != None:
    db.reference('times/'+str(uid)+'/session'+str(session)).child(str(key)).delete()
    return 'Deleted solve.'

def delete_session(uid, session):
  if db.reference('times/'+str(uid)+'/session'+str(session)).get() != None:
    db.reference('times/'+str(uid)+'/session'+str(session)).delete()
    return 'Deleted session.'

def send_chat_message(uid, group, message):
  db.reference('/chat/' + str(group)).push({
    'author': uid,
    'message': message,
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
          if group == requiredGroup:
            for fcmToken, fcmTokenUid in fcmTokens.items():
              if fcmTokenUid == user:
                message_title = str(username) + ' has sent a message'
                if len(message) > 50:
                  message = str(message[0:50]) + '...'
                push_service.notify_single_device(registration_id=fcmToken, message_title=message_title, message_body=message, message_icon=profilePic)
                print('Notified ' + str(user))
      except Exception as e:
        print('Error '+ str(e))

def update_email_address(uid, email):
  db.reference('users/' + uid).child('email').set(str(email))
  return 'updated email to ' + str(email) + '.'

def update_profile_pic(uid, profilePic):
  db.reference('users/' + uid).child('profilePic').set(str(profilePic))
  return 'updated profile pic to ' + str(profilePic) + '.'

def update_phone_number(uid, phone):
  db.reference('users/' + uid).child('phone').set(str(phone))
  return 'updated number to ' + str(phone) + '.'

def update_location(uid, location):
  db.reference('users/' + uid).child('location').set(str(location))
  return 'updated location to ' + str(location) + '.'

def update_bio(uid, bio):
  db.reference('users/' + uid).child('bio').set(str(bio))
  return 'updated bio to ' + str(bio) + '.'
