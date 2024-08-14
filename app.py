from flask import Flask, render_template,make_response
from flask import request,jsonify
from exp_calc import MyExcelfile
import os
# from dataentry import get_amount,get_category,get_date,get_description


app = Flask(__name__)


def format_date(date_string):
    if not date_string:
        return None
    year,month,day = date_string.split('-')
    return f"{month}-{day}-{year}"


@app.route('/')
def index():
    response = make_response(render_template('index.html'))
    response.headers['Cache-Control']= 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/addtransaction', methods = ["POST"])
def adddata():
    """
    takes in parameters:   @date, @category, @amount, @description
    """
    date = request.form["date"]
    date = format_date(date)
    category = request.form["category"]
    amount = request.form["amount"]
    description = request.form["description"]

    if not date or not category or not amount:
        return "mandatory fields cannot be empty. Please enter date , category and amount.", "400"

    MyExcelfile.initialize_excel()
    MyExcelfile.add_entry(date,category,amount,description)
    return "201"



@app.route('/transactionsummary')
def transaction_summary():

    sdate = request.args.get("sdate")
    edate = request.args.get("edate")
    sdate = format_date(sdate)
    edate = format_date(edate)
    result = MyExcelfile.get_transaction(sdate,edate)

    return  jsonify(result)


if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    