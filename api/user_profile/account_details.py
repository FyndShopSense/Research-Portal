from flask import Blueprint, render_template, request
from flask import current_app as app
from flask_cors import CORS, cross_origin
from flask import jsonify

import flask_bcrypt
import pymysql

account_details_bp = Blueprint('account_details_bp', __name__)


# Account details module
@account_details_bp.route('/api/account/details', methods=['POST'])
def get_account_details():
    if request.method == 'POST':
        data_login = (request.json)
        print("Login Request:", data_login)
        user_email = data_login['user_email']

        if not user_email:
            return 'Email field empty', 400

        db = pymysql.connect("sql284.main-hosting.eu", "u133349638_sih_team", "?/lL@YA$", "u133349638_researchportal")
        cursor = db.cursor()

        params = [user_email]
        cursor.execute(
            "SELECT user_id, user_email, user_name, user_password, user_institute, "
            "user_city, user_homepage, user_phone_number, user_interests "
            "FROM account WHERE user_email=%s",
            params)

        db_account = cursor.fetchone()

        cursor.close()
        db.close()

        try:
            if db_account is not None and db_account[0]:
                details = {
                    "user_id": db_account[0],
                    "user_email": db_account[1],
                    "user_name": db_account[2],
                    "user_password": db_account[3],
                    "user_institute": db_account[4],
                    "user_city": db_account[5],
                    "user_homepage": db_account[6],
                    "user_phone_number": db_account[7],
                    "user_interests": db_account[8]
                }
                return jsonify(details), 200
            else:
                return 'Invalid Credentials', 401
        except:
            return 'Invalid Credentials', 401
