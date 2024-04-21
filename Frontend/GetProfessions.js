console.log(typeof(localStorage["data"]) + JSON.parse(localStorage["data"])[0].name);

const dataContainer = document.getElementById('dataContainer');

responseData = JSON.parse(localStorage["data"]);

function handlerButton(responseData){
    for (let i = 0; i < responseData.length; i++){
        console.log(i);
        const divElement = document.createElement('div');
		divElement.classList.add('item');
        let pElement = document.createElement('p');
        pElement.textContent = `Название направления: ${responseData[i].name}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Конкурсная группа: ${responseData[i].group}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Проходной балл на бюджет: ${responseData[i].total_score}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Стоимость обучения за год: ${responseData[i].price_contract}`;
        divElement.appendChild(pElement);
        dataContainer.appendChild(divElement);
    }
}

handlerButton(responseData);