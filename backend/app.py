from flask import Flask, Response, render_template
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

sphere={
        "гуманитарная сфера":[
            [
                "42.03.01",
                "45.03.01"
            ]
        ],
        "информационно-измерительные и биотехнические системы":[
            [
                "12.03.01",
                "12.03.04",
                "20.03.01"
            ]
        ],
        "компьютерный технологии и информатика":[
            [
                "09.03.01",
                "01.03.02",
                "09.03.02",
                "27.03.03",
                "09.03.04",
                "27.03.04",
                "10.05.01"
            ]
        ],
        "радиотехника и телекоммуникация":[
            [
                "11.03.01",
                "11.03.02",
                "11.03.03",
                "11.05.01"
            ]
        ],
        "электроника":[
            [
                "11.03.04",
                "28.03.01"
            ]
        ],
        "электротехника и автоматика":[
            [
                "15.03.06",
                "13.03.02",
                "27.03.04"
            ]
        ]
}
coefs={
    "gto":4,
    "medal":5,
    "Volunteering":4
}

class DBAdapter:

    def __init__(self):
        self.conn = psycopg2.connect(**db_config)

    def query(self, sql_query):
        cursor = self.conn.cursor()

        cursor.execute(sql_query)
        answer=cursor.fetchall()
        answer_json= json.dumps(answer)
        cursor.close()
        return answer_json


db = DBAdapter()

@app.route('/jobs',methods=['GET'])
def jobs():
    data = ["гуманитарная сфера","информационно-измерительные и биотехнические системы","компьютерный технологии и информатика","радиотехника и телекоммуникация","электроника","электротехника и автоматика" ]
    return json.dumps(data)

@app.route('/',methods=['GET'])
def home():
    return render_template('test.html') 
    


@app.route('/courses', methods=['POST'])
def courses():
    # {russian: ${russian}, math: ${math}, social: ${social}, language: ${language}, informat: ${informat},
    #              biology: ${biology}, geography: ${geography}, chemistry: ${chemistry}, physics: ${physics}, history: ${history},
    #             literature: ${literature}, isMedal: ${isMedal}, isGto: ${isGto}, isVolunteering: ${isVolunteering}};
    data = json.loads(Response.form.get('json_data'))
    total = 0
    for value in data.values():
        if isinstance(value, (int, float)):
            total += value
    individual=0
    if data["isGto"]:
        individual+=coefs["gto"]
    if data["isMedal"]:
        individual+=coefs["medal"]
    if data["isVolunteering"]:
        individual+=coefs["Volunteering"]
    total+=min(individual,10)
    jobs=json.dumps(sphere[data['fieldactivity']])
    #jobs=['11.03.04','28.03.01']

    return db.query("SELECT name,group,total_score,price FROM courses WHERE {total}>= total_score AND code IN {jobs};" )
    #return data

if __name__ == "__main__":
    app.run(debug=True, port=port)
