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
        ],
        "инновационное проектирование и техническое предпринимательство":[
            "38.03.02",
            "27.03.02",
            "27.03.05"
        ]        
}
plan={
    "42.03.01": {
        "обществознание":7,
        "лингвистика":3,
    },
    "45.03.02":[
        "обществознание":3,
        "лингвистика":7
    ],
    "12.03.01":[
        "математика":3,
        "физика":3,
        "метрология":4
    ],
    "12.03.04":[
        "математика":3,
        "физика":4,
        "метрология":3
    ],
    "20.03.01":[
        "математика":4,
        "физика":3,
        "метрология":3
    ],
    "09.03.01":[
        "математика":2,
        "программирование":2,
        "информатика":6
    ],
    "01.03.02":[
        "математика":6,
        "программирование":1,
        "информатика":3
    ],
    "09.03.02":[
        "математика":2,
        "программирование":4,
        "информатика":4
    ],
    "27.03.03":[
        "математика":4,
        "программирование":4,
        "информатика":2
    ],
    "09.03.04":[
        "математика":1,
        "программирование":7,
        "информатика":2
    ],
    "27.03.04":[
        "математика":4,
        "программирование":2,
        "информатика":4
    ],
    "10.05.01":[
        "математика":5,
        "программирование":1,
        "информатика":4
    ],
    "11.03.01":[
        "радиотехника":8,
        "физика":1,
        "математика":1
    ],
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
    data = ["гуманитарная сфера","информационно-измерительные и биотехнические системы","компьютерный технологии и информатика","радиотехника и телекоммуникация","электроника","электротехника и автоматика","инновационное проектирование и техническое предпринимательство"]
    return json.dumps(data)

@app.route('/all_courses',method=['GET'])
def courses():
    return db.query("SELECT name FROM courses GROUP BY name;" )

@app.route('/changeCourse',method=['POST'])
def change():
    data = json.loads(Response.form.get('json_data'))
    return db.query(f"SELECT name,group,total_score,price_contract FROM courses WHERE {total}>= total_score AND code IN {jobs} ORDER BY code;" )
    




@app.route('/courses', methods=['POST'])
def courses():
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
    return db.query(f"SELECT distinct courses.group, courses.name, courses.price_contract, courses.total_score FROM courses, json_array_elements(exams) as exam WHERE ((exam->>'Name' = 'Математика') and ((exam->>'MinScore')::int <= 100) or (exam->>'Name' = 'Русский язык') and ((exam->>'MinScore')::int <= 100) or (exam->>'Name' = 'Информатика') and ((exam->>'MinScore')::int <= 100)) and (code in {jobs}) and total_score <= 300;" )
    #return data

if __name__ == "__main__":
    app.run(debug=True, port=port)


SELECT distinct courses.group, courses.name, courses.price_contract, courses.total_score
FROM courses, json_array_elements(exams) as exam
WHERE ((exam->>'Name' = 'Математика') and ((exam->>'MinScore')::int <= 100) or (exam->>'Name' = 'Русский язык') and ((exam->>'MinScore')::int <= 100) or (exam->>'Name' = 'Информатика') and ((exam->>'MinScore')::int <= 100)) and (code in {jobs}) and total_score <= 300;