from flask import Flask, Response
import json
import psycopg2

port = 5000

app = Flask(__name__)

db_config = {
    'dbname': 'student_courses',
    'user': 'test',
    'password': 'test',
    'host': 'localhost',
    'port': '5432'
}


class DBAdapter:

    def __init__(self):
        self.conn = psycopg2.connect(**db_config)

    def query(self, sql_query):
        cursor = self.conn.cursor()

        cursor.execute(sql_query)

        cursor.close()


db = DBAdapter()


@app.route('/courses', methods=['POST'])
def courses():
    # {russian: ${russian}, math: ${math}, social: ${social}, language: ${language}, informat: ${informat},
    #              biology: ${biology}, geography: ${geography}, chemistry: ${chemistry}, physics: ${physics}, history: ${history},
    #             literature: ${literature}, isMedal: ${isMedal}, isGto: ${isGto}, isVolunteering: ${isVolunteering}};
    data = json.loads(Response.form.get('json_data'))

    return data


if __name__ == "__main__":
    app.run(debug=True, port=port)
