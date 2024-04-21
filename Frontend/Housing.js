const form = document.getElementById('form');
form.addEventListener('submit', getFormValue);

function getFormValue(event) {
    event.preventDefault();

    var address = form.querySelector('[name="address"]');
    address = address.value;
    console.log("address = " + address);
    
    var money = form.querySelector('[name="money"]');
    money = money.value;
    console.log("money = " + money);
    
    const data = {address: `${address}`, money: `${money}`};
    putInfo(data);
}

let res;
const putInfo = async (data) => {
    try {
      const url = `http://localhost:5000/houses`;
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
      window.location.href = 'GetHousing.html';
      
    } catch (error){
        console.error('Error updating data:', error.message);
    }
  };