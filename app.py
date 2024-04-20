from flask import Flask, render_template
import json

port=5000

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/courses', methods=['GET'])
def courses():
    data = request.get_json()  # Получение данных JSON из запроса
    return answer
    



if __name__ == "__main__":
    app.run(debug=True,port=port)