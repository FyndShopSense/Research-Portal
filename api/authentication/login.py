from flask import Blueprint, render_template, request
from flask import current_app as app
from flask_cors import CORS, cross_origin
from flask import jsonify

import flask_bcrypt
import pymysql

login_bp = Blueprint('login_bp', __name__)


# CORS(login_bp, resources={r'/api/*': {"origins": "*"}})


# login module
@login_bp.route('/api/login/', methods=['POST'])
def login_user():
    if request.method == 'POST':
        data_login = (request.json)
        print("Login Request:", data_login)
        user_email = data_login['user_email']
        password = data_login['password']

        if not user_email:
            return 'Email field empty', 400
        elif not password:
            return 'Password field empty', 400

        db = pymysql.connect("sql284.main-hosting.eu", "u133349638_sih_team", "?/lL@YA$", "u133349638_researchportal")
        cursor = db.cursor()

        params = [user_email]
        cursor.execute(
            "SELECT user_email, user_password, user_name, user_id, user_institute FROM account WHERE user_email=%s",
            params)

        db_pass = cursor.fetchone()

        cursor.close()
        db.close()

        try:
            if db_pass is not None and db_pass[1] and bool(flask_bcrypt.check_password_hash(db_pass[1], password)):
                details = {"user_name": db_pass[2], "user_id": db_pass[3], "user_institute": db_pass[4]}
                return jsonify(details), 200
            else:
                return 'Invalid Credentials', 401
        except:
            return 'Invalid Credentials', 401
