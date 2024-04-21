window.addEventListener('DOMContentLoaded', async () => {
    try {
      const url = 'http://localhost:5000/jobs';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      data = await response.json();
      sizeData = data.length;
      fillSelect(data, sizeData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
});


function fillSelect(data, sizeData) {
    const selectElement = document.getElementById('fieldactivity');
    selectElement.innerHTML = '';

    for (let i = 0; i < sizeData; i++) {
        const optionElement = document.createElement('option');
        optionElement.textContent = data[i];
        optionElement.value = data[i];
        selectElement.appendChild(optionElement);
    }
}

const form = document.getElementById('form');
form.addEventListener('submit', getFormValue);

function getFormValue(event) {
    event.preventDefault();
    
    var selectElement = document.getElementById("fieldactivity");

    var selectedOption = selectElement.options[selectElement.selectedIndex];

    var selectedValue = selectedOption.value;

    console.log("Выбранное значение: " + selectedValue);

    var russian = form.querySelector('[name="russian"]');
    russian = russian.value;
    if (russian === "")
        russian = null;
    console.log("russian = " + russian);
    
    var math = form.querySelector('[name="math"]');
    math = math.value;
    if (math === "")
        math = null;
    console.log("math = " + math);

    var social = form.querySelector('[name="social"]');
    social = social.value;
    if (social === "")
        social = null;
    console.log("social = " + social);

    var language = form.querySelector('[name="language"]');
    language = language.value;
    if (language === "")
        language = null;
    console.log("language = " + language);

    var informat = form.querySelector('[name="informat"]');
    informat = informat.value;
    if (informat === "")
        informat = null;
    console.log("informat = " + informat);

    var biology = form.querySelector('[name="biology"]');
    biology = biology.value;
    if (biology === "")
        biology = null;
    console.log("biology = " + biology);

    var geography = form.querySelector('[name="geography"]');
    geography = geography.value;
    if (geography === "")
        geography = null;
    console.log("geography = " + geography);

    var chemistry = form.querySelector('[name="chemistry"]');
    chemistry = chemistry.value;
    if (chemistry === "")
        chemistry = null;
    console.log("chemistry = " + chemistry);

    var physics = form.querySelector('[name="physics"]');
    physics = physics.value;
    if (physics === "")
        physics = null;
    console.log("physics = " + physics);

    var history = form.querySelector('[name="history"]');
    history = history.value;
    if (history === "")
        history = null;
    console.log("history = " + history);

    var literature = form.querySelector('[name="literature"]');
    literature = literature.value;
    if (literature === "")
        literature = null;
    console.log("literature = " + literature);


    var medalCheckbox = document.getElementById("medal");
    var isMedal = medalCheckbox.checked;
    
    var gtoCheckbox = document.getElementById("gto");
    var isGto = gtoCheckbox.checked;
    
    var volunteeringCheckbox = document.getElementById("volunteering");
    var isVolunteering = volunteeringCheckbox.checked;
    
    const data = {fieldactivity: `${selectedValue}`, "Русский язык": `${russian}`, "Математика": `${math}`, "Обществознание": `${social}`, "Английский язык": `${language}`, "Информатика": `${informat}`, 
                  "Биология": `${biology}`, "География": `${geography}`, "Химия": `${chemistry}`, "Физика": `${physics}`, "История": `${history}`, 
                  "Литература": `${literature}`, isMedal: `${isMedal}`, isGto: `${isGto}`, isVolunteering: `${isVolunteering}`};
    putInfo(data);
}

let res;
const putInfo = async (data) => {
    try {
      const url = `http://localhost:5000/courses`;
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
      window.location.href = 'GetProfessions.html';
  
    } catch (error){
        console.error('Error updating data:', error.message);
    }
  };

