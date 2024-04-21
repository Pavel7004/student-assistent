window.addEventListener("DOMContentLoaded", async () => {
  try {
    const url = "http://localhost:5000/courses/all";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    sizeData = data.length;
    fillSelect(data, sizeData);
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const url = "http://localhost:5000/jobs";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    sizeData = data.length;
    fillSelect2(data, sizeData);
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
});

function fillSelect(data, sizeData) {
  const selectElement = document.getElementById("courses");
  selectElement.innerHTML = "";

  for (let i = 0; i < sizeData; i++) {
    const optionElement = document.createElement("option");
    optionElement.textContent = data[i];
    optionElement.value = data[i];
    selectElement.appendChild(optionElement);
  }
}

function fillSelect2(data, sizeData) {
  const selectElement = document.getElementById("fieldactivity");
  selectElement.innerHTML = "";

  for (let i = 0; i < sizeData; i++) {
    const optionElement = document.createElement("option");
    optionElement.textContent = data[i];
    optionElement.value = data[i];
    selectElement.appendChild(optionElement);
  }
}

const form = document.getElementById("form");
form.addEventListener("submit", getFormValue);

function getFormValue(event) {
  event.preventDefault();

  var selectElement = document.getElementById("courses");

  var selectedOption = selectElement.options[selectElement.selectedIndex];

  var selectedValueCourse = selectedOption.value;

  console.log("Выбранное значение: " + selectedValueCourse);

  var score = form.querySelector('[name="score"]');
  score = score.value;
  console.log("score = " + score);

  selectElement = document.getElementById("fieldactivity");

  selectedOption = selectElement.options[selectElement.selectedIndex];

  var selectedValueFieldActivity = selectedOption.value;

  console.log("Выбранное значение: " + selectedValueFieldActivity);

  const data = {
    course: `${selectedValueCourse}`,
    score: `${score}`,
    fieldactivity: `${selectedValueFieldActivity}`,
  };
  putInfo(data);
}

let res;
const putInfo = async (data) => {
  try {
    const url = `http://localhost:5000/courses/translation`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log("biba1");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("Возвращенные данные: ", responseData);
    localStorage["data"] = JSON.stringify(responseData);
    window.location.href = "GetProfessionsTranslation.html";
  } catch (error) {
    console.error("Error updating data:", error.message);
  }
};

