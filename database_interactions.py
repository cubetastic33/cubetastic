from flask import Flask, render_template, request, send_from_directory, jsonify
import json
import database_interactions

app = Flask(__name__, static_url_path='/')

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/index')
def index_html():
  return render_template('index.html')

@app.route('/solve')
def solve_html():
  return render_template('solve.html')

@app.route('/timer')
def timer():
  return render_template('timer.html')

@app.route('/saveTime', methods=['POST'])
def saveTime():
  uid = request.form.getlist('uid')[0]
  time = request.form.getlist('time')[0]
  session = request.form.getlist('session')[0]
  scramble = request.form.getlist('scramble')[0]
  category = request.form.getlist('category')[0]
  plus_two = request.form.getlist('plus_two')[0]
  solve_date = request.form.getlist('solve_date')[0]
  return database_interactions.save_time(uid, time, session, scramble, category, plus_two, solve_date)

@app.route('/uploadSolves', methods=['POST'])
def uploadSolves():
  uid = request.form.getlist('uid')[0]
  solves = json.loads(request.form.getlist('solves')[0])
  return database_interactions.upload_solves(uid, solves)

@app.route('/penalizeSolve', methods=['POST'])
def penalizeSolve():
  uid = request.form.getlist('uid')[0]
  session = request.form.getlist('session')[0]
  key = request.form.getlist('key')[0]
  penalty = request.form.getlist('penalty')[0]
  return database_interactions.penalize_solve(uid, session, key, penalty)

@app.route('/deleteSolve', methods=['POST'])
def deleteSolve():
  uid = request.form.getlist('uid')[0]
  session = request.form.getlist('session')[0]
  key = request.form.getlist('key')[0]
  return database_interactions.delete_solve(uid, session, key)

@app.route('/deleteSession', methods=['POST'])
def deleteSession():
  uid = request.form.getlist('uid')[0]
  session = request.form.getlist('session')[0]
  return database_interactions.delete_session(uid, session)

@app.route('/saveSettings', methods=['POST'])
def saveSettings():
  uid = request.form.getlist('uid')[0]
  settings = request.form.getlist('settings')[0]
  return database_interactions.save_settings(uid, settings)

@app.route('/installpwa')
def installpwa():
  return render_template('installpwa.html')

@app.route('/contactMe')
def contactMe():
  return render_template('contactMe.html')

@app.route('/sendFeedback', methods=['POST'])
def sendFeedback():
  title = request.form.getlist('title')
  message = request.form.getlist('message')
  return database_interactions.send_feedback(title[0], message[0])

@app.route('/profile')
def profile():
  return render_template('profile.html')

@app.route('/updateEmailAddress', methods=['POST'])
def updateEmailAddress():
  uid = request.form.getlist('uid')[0]
  email = request.form.getlist('email')[0]
  return database_interactions.update_email_address(uid, email)

@app.route('/updateProfilePic', methods=['POST'])
def updateProfilePic():
  uid = request.form.getlist('uid')[0]
  profilePic = request.form.getlist('profilePic')[0]
  return database_interactions.update_profile_pic(uid, profilePic)

@app.route('/updatePhoneNumber', methods=['POST'])
def updatePhoneNumber():
  uid = request.form.getlist('uid')[0]
  phone = request.form.getlist('phone')[0]
  return database_interactions.update_phone_number(uid, phone)

@app.route('/updateLocation', methods=['POST'])
def updateLocation():
  uid = request.form.getlist('uid')[0]
  location = request.form.getlist('location')[0]
  return database_interactions.update_location(uid, location)

@app.route('/updateBio', methods=['POST'])
def updateBio():
  uid = request.form.getlist('uid')[0]
  bio = request.form.getlist('bio')[0]
  return database_interactions.update_bio(uid, bio)

@app.route('/signin')
def signin():
  return render_template('signin.html')

@app.route('/signup')
def signup():
  return render_template('signup.html')

@app.route('/userExists', methods=['POST'])
def userExists():
  uid = request.form.getlist('uid')[0]
  username = request.form.getlist('username')[0]
  return jsonify(database_interactions.user_exists(uid, username))

@app.route('/usernameExists', methods=['POST'])
def usernameExists():
  username = request.form.getlist('username')[0]
  return database_interactions.username_exists(username)

@app.route('/getEmail', methods=['POST'])
def getEmail():
  username = request.form.getlist('username')[0]
  return database_interactions.get_email(username)

@app.route('/createUser', methods=['POST'])
def createUser():
  uid = request.form.getlist('uid')[0]
  email = request.form.getlist('email')[0]
  location = request.form.getlist('location')[0]
  phone = request.form.getlist('phone')[0]
  photoURL = request.form.getlist('photoURL')[0]
  username = request.form.getlist('username')[0]
  return database_interactions.create_user(uid, email, location, phone, username, photoURL)

@app.errorhandler(404)
def page_not_found(e):
  return render_template('404.html'), 404

@app.route('/js/<path:path>')
def send_js(path):
  return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
  return send_from_directory('css', path)

@app.route('/images/<path:path>')
def send_images(path):
  return send_from_directory('images', path)

@app.route('/videos/<path:path>')
def send_videos(path):
  return send_from_directory('videos', path)

@app.route('/audio/<path:path>')
def send_audio(path):
  return send_from_directory('audio', path)

@app.route('/fonts/<path:path>')
def send_fonts(path):
  return send_from_directory('fonts', path)

@app.route('/firebase-messaging-sw.js')
def service_worker():
  return send_from_directory('static', 'firebase-messaging-sw.js')

@app.route('/manifest.json')
def manifest():
  return send_from_directory('static', 'manifest.json')

@app.route('/manifest1.json')
def manifest1():
  return send_from_directory('static', 'manifest1.json')

@app.route('/sitemap.xml')
def sitemap_xml():
  return send_from_directory('static', 'sitemap.xml')

if __name__ == '__main__':
  app.run(debug = True)
