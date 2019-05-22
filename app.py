from flask import Flask, url_for, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from operator import eq

app = Flask(__name__)
app.config['SECRET_KEY'] = 'this is secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test1.db'
app.config['SQLALCHEMY_BINDS'] = {
	'test1': 'sqlite:///test1.db',
	'test2': 'sqlite:///test2.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
	__tablename__ = "user"
	__bind_key__ = 'test1'
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	password = db.Column(db.String(256))
	deposit = db.Column(db.Integer)

	def __init__(self, username, password, deposit):
		self.username = username
		self.password = generate_password_hash(password)
		self.deposit = deposit

class Board(db.Model):
	__tablename__ = "post"
	__bind_key__ = 'test2'
	id = db.Column(db.Integer, primary_key=True)
	sendfrom = db.Column(db.String(80),nullable=False)
	sendto = db.Column(db.String(80),nullable=False)
	string = db.Column(db.String(2048))

	def __init__(self, sendto, sendfrom, string):
		self.sendto = sendto
		self.sendfrom = sendfrom
		self.string = string

@app.route('/priv', methods=['GET', 'POST'])
def priv():
	return render_template('trCube.html')

@app.route('/back', methods=['GET', 'POST'])
def back():
	if session.get('admin'):
		cur = User.query.filter_by(username='admin').first()
		return render_template('index.html',amount = cur.deposit)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
	if session.get('admin'):
		data = User.query.order_by(User.username.asc()).all()
		print(data)
		return render_template('admin.html',data = data)

@app.route('/deposit', methods=['GET', 'POST'])
def deposit():
	if not session.get('logged_in'):
		return render_template('index.html')
	else:
		if request.method == 'POST':
			deposit = request.form['deposit']
			if int(deposit)<0:
				print(int(deposit))
				return render_template('index.html', data='다시 입력',amount=cur.deposit)
			username = session['logged_in']
			cur = User.query.filter_by(username=username).first()
			cur.deposit += int(deposit)
			db.session.commit()
			return render_template('index.html',data='입금 완료',amount=cur.deposit)

@app.route('/transaction', methods=['GET', 'POST'])
def transaction():
	if not session.get('logged_in'):
		return render_template('index.html')
	else:
		if request.method == 'POST':
			username = session['logged_in']
			cur = User.query.filter_by(username=username).first()
			amount = request.form['amount']
			sendto  = request.form['sendto']
			if int(amount)<0:
				print(int(amount))
				return render_template('index.html', data='다시 입력',amount=cur.deposit)

			to = User.query.filter_by(username=sendto).first()
			if to is None:
				return render_template('index.html', data='받는 사람 없음.',amount=cur.deposit)
			if cur.deposit - int(amount) < 0:
				return render_template('index.html', data='잔액 부족',amount=cur.deposit)
			cur.deposit-=int(amount)
			to.deposit+=int(amount)
			db.session.commit()
			return render_template('index.html',data='입금 완료',amount=cur.deposit)

@app.route('/', methods=['GET', 'POST'])
def home():
	dup = User.query.filter_by(username='admin').first()
	if dup is None:
		new_user = User(username='admin', password='admin',deposit=0)
		db.session.add(new_user)
		db.session.commit()

	if not session.get('logged_in'):
		return render_template('index.html')
	else:
		if request.method == 'POST':
			string = request.form['string']
			sendto = request.form['to']
			sendfrom = session['logged_in']
			if eq(sendto, sendfrom):
				return render_template('index.html', data='보내는 이와 받는 이가 같음')
			if sendto is not None:
				new_post = Board(sendfrom=sendfrom, sendto=sendto, string=string)
				db.session.add(new_post)
				db.session.commit()
				return render_template('index.html', data='전송 완료')
			else:
				return render_template('index.html', data='받는이 없음', string=string)
		return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template('login.html')
	else:
		name = request.form['username']
		passw = request.form['password']
		cur = User.query.filter_by(username=name).first()
		try:
			if check_password_hash(cur.password, passw):
				# session_key = redis_session().save_session(name)
				session['logged_in'] = name
				if name == 'admin':
					session['admin'] = True
				# return redirect(url_for('home'))
				return render_template('index.html',amount=cur.deposit)
			else:
				return render_template('login.html', data='ID or PW is invalid')
		except:
			return render_template('login.html', data='ID or PW is invalid')

@app.route('/register/', methods=['GET', 'POST'])
##### password를 만드는데 id로 같이 들어가게 만들어놨음.
def register():
	if request.method == 'POST':
		id = request.form['username']
		dup = User.query.filter_by(username=id).first()
		if dup is None:
			pw = request.form['password']
			if len(pw) < 6:
				return render_template('register.html', data='Length of PW should be more than 5 characters.')
			new_user = User(username=id, password=pw,deposit=0)
			db.session.add(new_user)
			db.session.commit()
			return render_template('login.html')
		return render_template('register.html', data = 'ID is Duplicated')
	return render_template('register.html')

@app.route("/logout")
def logout():
	# session['logged_in'] = False
	if 'logged_in' in session:
		session['logged_in'] = False
	session['admin'] = False
	return redirect(url_for('home'))

if __name__ == '__main__':
	app.debug = False
	db.create_all()
	context = ('key.crt', 'key.key')
	app.run(host='localhost', port=12345, ssl_context=context)
