from flask import Blueprint, render_template, request
from flask import current_app as app
from flask_cors import CORS

import flask_bcrypt
import pymysql
import re

update_profile_bp = Blueprint('update_profile_bp', __name__)


# CORS(registration_bp, resources={r'/api/*': {"origins": "*"}})


@update_profile_bp.route('/api/profile/update', methods=['POST'])
def update_user_profile():
    data = (request.json)
    print(data)
    for field in data:
        if field in ['name', 'email', 'city', 'institute']:
            # Check if the data field is not empty
            if not data[field]:
                return 'Please fill the required fields!', 400

    # phone number validation
    if data['phone_number']:
        regex_p_no = re.compile('[6-9][0-9]{9}')
        is_valid_phone = bool(re.match(regex_p_no, data['phone_number']))
        if not is_valid_phone:
            return 'Phone number invalid', 400

    # homepage url validation
    if data['homepage']:
        homepage = data['homepage']
        regex_hp = re.compile(
            r'^(?:http|ftp)s?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        is_valid_homepage = bool(re.match(regex_hp, homepage))
        if not is_valid_homepage:
            return 'Homepage URL invalid', 400

    # Email Validation
    regex_email = re.compile('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$')
    is_valid_email = bool(re.match(regex_email, data['email']))
    if not is_valid_email:
        return 'Email address is invalid', 400

    # Establish database connection
    # db = pymysql.connect("156.67.222.22", "u133349638_sih_team", "?/lL@YA$", "u133349638_researchportal")
    db = pymysql.connect("sql284.main-hosting.eu", "u133349638_sih_team", "?/lL@YA$", "u133349638_researchportal")
    cursor = db.cursor()

    try:
        params = [data['name'], data['institute'], data['city'], data['homepage'],
                  data['phone_number'], data['interests'], data["email"]]

        sql = cursor.execute(
            'UPDATE account SET `user_name`=%s, `user_institute`=%s, `user_city`=%s, `user_homepage`=%s, `user_phone_number`=%s, `user_interests`=%s WHERE `user_email`=%s',
            params)
        db.commit()
        cursor.close()
        db.close()
        return 'Profile updated successfully!', 200
    # if count > 0:
    #     cursor.close()
    #     db.close()
    #     return 'Email address already exists! Please logging in.', 409

    # cursor.close()
    # cursor = db.cursor()
    #
    # # use prepared statement to avoid sql injection
    # try:
    #     params = [
    #         data['email'], data['name'], pass_hash, data['institute'], data['city'], data['homepage'],
    #         data['phone_number'], data['interests']
    #     ]
    #     sql = cursor.execute(
    #         "INSERT INTO `account` (`user_email`, `user_name`, `user_password`, `user_institute`, `user_city`, `user_homepage`, `user_phone_number`, `user_interests`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
    #         params)
    #     db.commit()
    #     cursor.close()
    #     db.close()
    #     return 'Your profile details have been updated successfully', 200
    except:
        db.rollback()
        cursor.close()
        db.close()
        return 'Error in updating profile!', 400
