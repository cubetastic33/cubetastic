from flask import Flask, render_template, request, send_from_directory, jsonify

app = Flask(__name__, static_url_path='/')

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/index.html')
def index_html():
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
  return render_template('timer.html')

@app.route('/smartTimer.html')
def smartTimer_html():
  return render_template('smartTimer.html')

@app.route('/videos.html')
def videos_html():
  return render_template('videos.html')

@app.route('/contactMe.html')
def contactMe_html():
  return render_template('contactMe.html')

@app.route('/profile.html')
def profile_html():
  return render_template('profile.html')

@app.route('/signin.html')
def signin_html():
  return render_template('signin.html')

@app.route('/signup.html')
def signup_html():
  return render_template('signup.html')

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

@app.route('/sitemap.xml')
def sitemap_xml():
  return send_from_directory('static', 'sitemap.xml')

if __name__ == '__main__':
  app.run(debug = True)
