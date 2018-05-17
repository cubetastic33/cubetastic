from flask import Flask, render_template, request, send_from_directory, jsonify
import database_interactions

app = Flask(__name__, static_url_path='/')

@app.route('/')
def index():
  database_interactions.notifyUsersInGroup('7PtpjgYYmpPQU8loZliCjbhYfw43', 'group1', 'Opened index.html')
  return render_template('index.html')

@app.route('/index.html')
def index_html():
  database_interactions.notifyUsersInGroup('7PtpjgYYmpPQU8loZliCjbhYfw43', 'group1', 'Opened index.html')
  return render_template('index.html')

@app.route('/solve.html')
def solve_html():
  return render_template('solve.html')

@app.route('/pdfs.html')
def pdfs_html():
  return render_template('pdfs.html')

@app.route('/train.html')
def train_html():
  return render_template('train.html')

@app.route('/timer.html')
def timer_html():
  database_interactions.notifyUsersInGroup('7PtpjgYYmpPQU8loZliCjbhYfw43', 'group1', 'Opened timer.html')
  return render_template('timer.html')

@app.route('/collabicube.html')
def collabicube_html():
  return render_template('collabicube.html')

@app.route('/chat.html')
def chat_html():
  return render_template('chat.html')

@app.route('/installpwa.html')
def installpwa_html():
  return render_template('installpwa.html')

@app.route('/smartTimer.html')
def smartTimer_html():
  return render_template('smartTimer.html')

@app.route('/videos.html')
def videos_html():
  return render_template('videos.html')

@app.route('/contactMe.html')
def contactMe_html():
  return render_template('contactMe.html')

@app.route('/sendFeedback', methods=['POST'])
def sendFeedback():
  title = request.form.getlist('title')
  message = request.form.getlist('message')
  return database_interactions.send_feedback(title[0], message[0])

@app.route('/sendChatMessage', methods=['POST'])
def sendChatMessage():
  uid = request.form.getlist('uid')[0]
  group = request.form.getlist('group')[0]
  message = request.form.getlist('message')[0]
  return database_interactions.send_chat_message(uid, group, message)

@app.route('/profile.html')
def profile_html():
  return render_template('profile.html')

@app.route('/signin.html')
def signin_html():
  return render_template('signin.html')

@app.route('/signup.html')
def signup_html():
  return render_template('signup.html')

@app.route('/createUser', methods=['POST'])
def createUser():
  uid = request.form.getlist('uid')[0]
  email = request.form.getlist('email')[0]
  location = request.form.getlist('location')[0]
  phone = request.form.getlist('phone')[0]
  username = request.form.getlist('username')[0]
  return database_interactions.create_user(uid, email, location, phone, username)

@app.errorhandler(404)
def page_not_found(e):
  return render_template('404.html'), 404

@app.route('/js/<path:path>')
def send_js(path):
  return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
  return send_from_directory('css', path)

@app.route('/pdfs/<path:path>')
def send_pdf(path):
  return send_from_directory('pdfs', path)

@app.route('/images/<path:path>')
def send_images(path):
  return send_from_directory('images', path)

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
