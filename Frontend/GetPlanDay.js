console.log(typeof(localStorage["data"]) + JSON.parse(localStorage["data"])[0].name);

const dataContainer = document.getElementById('dataContainer');

responseData = JSON.parse(localStorage["data"]);

function handlerButton(responseData){
    for (let i = 0; i < responseData.length; i++){
        console.log(i);
        const divElement = document.createElement('div');
		divElement.classList.add('item');
        let pElement = document.createElement('p');
        pElement.textContent = `Адрес мероприятия: ${responseData[i].address}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Время начала мероприятия: ${responseData[i].time}`;
        divElement.appendChild(pElement);
        dataContainer.appendChild(divElement);
    }
}

handlerButton(responseData);