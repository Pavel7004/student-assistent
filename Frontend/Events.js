const form = document.getElementById('form');
form.addEventListener('submit', getFormValue);

function getFormValue(event) {
    event.preventDefault();

    var group = form.querySelector('[name="group"]');
    group = group.value;
    console.log("group = " + group);

    var address = form.querySelector('[name="address"]');
    address = address.value;
    console.log("address = " + address);
    
    selectElement = document.getElementById("event");

    selectedOption = selectElement.options[selectElement.selectedIndex];

    var selectedValueEvent = selectedOption.value;

    console.log("Выбранное значение: " + selectedValueEvent);
    
    const data = {event: `${selectedValueEvent}`, group: `${group}`, address: `${address}`};
    putInfo(data);
}

let res;
const putInfo = async (data) => {
    try {
      const url = `http://localhost:5000/events`;
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
      window.location.href = 'GetEvents.html';
      
    } catch (error){
        console.error('Error updating data:', error.message);
    }
  };