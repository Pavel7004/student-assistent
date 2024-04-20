//const buttonAddBook = document.getElementById('addBook');
//buttonAddBook.onclick = addBook;

document.addEventListener("DOMContentLoaded", function() {
  function myFunction() {
    var dropdown = document.getElementById("myDropdown");
    if (dropdown.style.display === "none") {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  }
  
  document.getElementById("menu").addEventListener("click", myFunction);
});
/*
function addBook(){
    window.location = "addBook.html";
}

const buttonAllBooks = document.getElementById('allBooks');
buttonAllBooks.onclick = allBooks;
function allBooks(){
  	fetchDataFromServer();
}

const buttonStockBooks = document.getElementById('stockBooks');
buttonStockBooks.onclick = getStockBooks;

const buttonOverdueBooks = document.getElementById('overdueBooks');
buttonOverdueBooks.onclick = getOverdueBooks;

const dataContainer = document.getElementById('dataContainer');

function handlerButton(responseData){
    for (let i in responseData){
        const divElement = document.createElement('div');
		divElement.classList.add('item');
        let pElement = document.createElement('p');
        pElement.textContent = `Название: ${responseData[i].title}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Автор: ${responseData[i].author}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Дата публикации: ${responseData[i].date_public}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Читатель: ${responseData[i].reader}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = `Дата возврата: ${responseData[i].date_return}`;
        divElement.appendChild(pElement);
        pElement = document.createElement('p');
        pElement.textContent = "";
        divElement.appendChild(pElement);

        let btn = document.createElement('button');
        let result = "";
        let bool = false;
        if(responseData[i].reader === ""){
            btn.innerHTML = '<i class = "fa fa-hand-point-right"></i> Взять';
            bool = true;    
        }
        else{
            btn.innerHTML = '<i class = "fa fa-undo"></i> Вернуть';
        }
        btn.addEventListener('click', function () {
          	if(bool){
				dataContainer.innerHTML = "";
				localStorage["id"] = i;
				window.location	= "takeBook.html";
			}
			else{
				dataContainer.innerHTML = "";
				updateData(i);
			}
        });
        divElement.appendChild(btn);

        btn = document.createElement('button');
        btn.innerHTML = '<i class = "fa fa-edit"></i> Редактировать';
        btn.addEventListener('click', function () {
			localStorage["id"] = i;
			localStorage["title"] = responseData[i].title;
			localStorage["author"] = responseData[i].author;
			localStorage["date_public"] = responseData[i].date_public;
			window.location = "changeBook.html";
        });
        divElement.appendChild(btn);

        btn = document.createElement('button');
        btn.innerHTML = '<i class = "fa fa-trash-alt"></i> Удалить';
        btn.classList.add('delete-btn')
        btn.addEventListener('click', function () {
			alert(`Вы действительно хотите удалить книгу ${responseData[i].title}?`);
            dataContainer.innerHTML = "";
            deleteData(i);
        });
        divElement.appendChild(btn);
        dataContainer.appendChild(divElement);
    }
}


const fetchDataFromServer = async () => {
    try {
      const url = 'http://localhost:3000/api/data';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log('Data received from the server:', responseData);
	  dataContainer.innerHTML = "";
      handlerButton(responseData);
    } catch (error) {
        console.error('Error fetching data from the server:', error.message);
    }
  };
  fetchDataFromServer();

  
  const deleteData = async (itemId) => {
    try {
      const url = `http://localhost:3000/api/delete/${itemId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchDataFromServer();
      console.log(`Item with ID ${itemId} deleted successfully`);
  
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };
  


function getStockBooks(){
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
		  	if (xhr.status === 200) {
				const responseData = JSON.parse(xhr.responseText);
				console.log('Data received from server:', responseData);
				dataContainer.innerHTML = "";
				handlerButton(responseData);
			} 
			else {
				console.error('Error:', xhr.status);
			}
		}
	};
	xhr.open('GET', 'http://localhost:3000/api/stock', true);
	xhr.send();
}

function getOverdueBooks(){
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
		  	if (xhr.status === 200) {
				const responseData = JSON.parse(xhr.responseText);
				console.log('Data received from server:', responseData);
				dataContainer.innerHTML = "";
				handlerButton(responseData);
			} 
			else {
				console.error('Error:', xhr.status);
			}
		}
	};
	xhr.open('GET', 'http://localhost:3000/api/overdue', true);
	xhr.send();
}


const updateData = async (id) => {
    const dataSend = {id: `${id}`};
    try {
      const url = `http://localhost:3000/api/update`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataSend),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchDataFromServer();
      console.log(`Item with ID ${id} updated successfully`);

    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };*/