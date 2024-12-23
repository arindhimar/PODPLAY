# from flask import Blueprint, render_template, request, redirect, url_for, flash, session
# # from flask_login import login_user, logout_user, login_required
# from models import User
# from forms import LoginForm, RegisterForm

# auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# # Route for login page
# @auth_bp.route('/login', methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(email=form.email.data).first()
#         if user and user.check_password(form.password.data):
#             login_user(user)
#             flash('Login successful!', 'success')
#             return redirect(url_for('music.view_music'))  # Redirect to music page or wherever appropriate
#         flash('Invalid credentials!', 'danger')
#     return render_template('login.html', form=form)

# # Route for registration page
# @auth_bp.route('/register', methods=['GET', 'POST'])
# def register():
#     form = RegisterForm()
#     if form.validate_on_submit():
#         user = User(email=form.email.data, password=form.password.data)
#         db.session.add(user)
#         db.session.commit()
#         flash('Registration successful! You can now log in.', 'success')
#         return redirect(url_for('auth.login'))
#     return render_template('register.html', form=form)

# # Route for logging out
# @auth_bp.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     flash('You have been logged out.', 'info')
#     return redirect(url_for('auth.login'))
