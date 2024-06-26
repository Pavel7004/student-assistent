from flask import Flask, request
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

sphere = {
    "гуманитарная сфера": ["42.03.01", "45.03.01"],
    "информационно-измерительные и биотехнические системы":
    ["12.03.01", "12.03.04", "20.03.01"],
    "компьютерный технологии и информатика": [
        "09.03.01", "01.03.02", "09.03.02", "27.03.03", "09.03.04", "27.03.04",
        "10.05.01"
    ],
    "радиотехника и телекоммуникация":
    ["11.03.01", "11.03.02", "11.03.03", "11.05.01"],
    "электроника": ["11.03.04", "28.03.01"],
    "электротехника и автоматика": ["15.03.06", "13.03.02", "27.03.04"],
    "инновационное проектирование и техническое предпринимательство":
    ["38.03.02", "27.03.02", "27.03.05"]
}

coefs = {"gto": 4, "medal": 5, "Volunteering": 4}


class DBAdapter:

    def __init__(self):
        self.conn = psycopg2.connect(**db_config)

    def query(self, sql_query):
        cursor = self.conn.cursor()

        cursor.execute(sql_query)
        answer = cursor.fetchall()
        cursor.close()

        return answer


db = DBAdapter()


@app.route('/addeducation', methods=['POST'])
def addeducation():
    data = [
        "Цифровая кафедра", "Курсы по программированию",
        "Олимпиадная математика"
    ]

    return json.dumps(data, ensure_ascii=False)


@app.route('/houses', methods=['POST'])
def houses():
    data = [
        {
            "address": "ул. Орбели д. 19 кв. 128",
            "money": 10000
        },
        {
            "address": "ул. Торжковская д. 15",
            "money": 2000
        },
        {
            "address": "СВАЛКА",
            "money": 0
        },
    ]
    return json.dumps(data, ensure_ascii=False)


@app.route('/planday', methods=['POST'])
def planday():
    data = [{"address": "ул. Авиационная д. 9", "time": "28.04.24 23:30"}]

    return json.dumps(data, ensure_ascii=False)


@app.route('/events', methods=['POST'])
def events():
    data = [{
        "name": "Научный доклад",
        "time": "30.04.24 13:40",
        "position": "ул. Профессора Попова д. 5"
    }, {
        "name": "Зенит-Спартак",
        "time": "17.04.24 19:30",
        "position": "Футбольная аллея д. 1"
    }, {
        "name": "Вызов",
        "time": "21.04.24 20:30",
        "position": "ст. м. Проспект Просвещения"
    }]

    return json.dumps(data, ensure_ascii=False)


@app.route('/jobs', methods=['GET'])
def jobs():
    return json.dumps(list(sphere.keys()), ensure_ascii=False)


@app.route('/courses/all', methods=['GET'])
def all_courses():
    return db.query("SELECT name FROM courses GROUP BY name;")


@app.route('/courses/translation', methods=['POST'])
def change():
    data = ["Электроника", "Нанотехнологии", "Электротехника"]

    return json.dumps(data, ensure_ascii=False)


@app.route('/courses', methods=['POST'])
def courses():
    data = request.get_json()

    print(data)

    jobs = sphere[data['fieldactivity']]
    data.pop('fieldactivity')
    jobs = ", ".join(map(lambda x: "'" + x + "'", jobs))
    total = calculate_total(data, jobs)

    res = db.query(form_query_courses(data, jobs, total))
    print("Query result:" + str(res))
    return convert_to_json(res)


def calculate_total(data, jobs):
    total = 0
    if data["isGto"]:
        total += coefs["gto"]
        data.pop("isGto")
    if data["isMedal"]:
        total += coefs["medal"]
        data.pop("isMedal")
    if data["isVolunteering"]:
        total += coefs["Volunteering"]
        data.pop("isVolunteering")
    total += min(total, 10)

    required_subjects = db.query(f'''
    SELECT DISTINCT exam->>'Name'
    FROM courses, json_array_elements(exams) AS exam
    WHERE courses.code in ({jobs})
    ''')
    required_subjects = list(map(lambda x: x[0], required_subjects))

    print("Required courses: " + str(required_subjects))
    for key, value in data.items():
        if key in required_subjects:
            print(key)
            if value == "null":
                value = 0
            total += int(value)

    print("Got total: " + str(total))

    return total


def form_query_courses(data, jobs, total):
    # { russian: ${russian}, math: ${math}, social: ${social},
    #   language: ${language}, informat: ${informat},
    #   biology: ${biology}, geography: ${geography},
    #   chemistry: ${chemistry}, physics: ${physics}, history: ${history},
    #   literature: ${literature}, isMedal: ${isMedal},
    #   isGto: ${isGto}, isVolunteering: ${isVolunteering} }

    q = '''
    SELECT DISTINCT
    courses.group, courses.name, courses.price_contract, courses.total_score
    FROM courses, json_array_elements(exams) AS exam
    WHERE (
    '''
    for name, result in data.items():
        if result != "null":
            q += f'''
            (exam->>'Name' = '{name}') and
            ((exam->>'MinScore')::int <= {result}) or'''

    # Replace last "or" with "and"
    q = q[:-3] + f''')
    and (code in ({jobs}))
    and total_score <= {total};'''

    return q


def convert_to_json(data):
    res = []
    for entry in data:
        res.append({
            "name": entry[1],
            "group": entry[0],
            "price_contract": entry[2],
            "total_score": entry[3],
        })

    return json.dumps(res, ensure_ascii=False)


if __name__ == "__main__":
    app.run(debug=True, port=port)
