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

    var address = form.querySelector('[name="address"]');
    address = address.value;
    console.log("address = " + address);
    
    var group = form.querySelector('[name="group"]');
    group = group.value;
    console.log("group = " + group);

    selectElement = document.getElementById("event");

    selectedOption = selectElement.options[selectElement.selectedIndex];

    var selectedValueEvent = selectedOption.value;

    console.log("Выбранное значение: " + selectedValueEvent);
    
    const data = {address: `${address}`, group: `${group}`, selectedValueEvent: `${selectedValueEvent}`};
    putInfo(data);
}

let res;
const putInfo = async (data) => {
    try {
      const url = `http://localhost:5000/addeducation`;
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
      window.location.href = 'GetAdditionalEducation.html';
      
    } catch (error){
        console.error('Error updating data:', error.message);
    }
  };