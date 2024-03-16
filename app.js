import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL:
    'https://add-to-cart-database-92a88-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const buttonElement = document.getElementById('add-button');
const inputFieldElement = document.getElementById('input-field');
const shoppingListElement = document.getElementById('shopping-list');

buttonElement.addEventListener('click', addToCart);

function addToCart() {
  let inputValue = inputFieldElement.value.trim();
  if (inputValue !== '') {
    push(shoppingListInDB, inputValue);
    clearInputFieldElement();
  } else {
    alert('Please enter an item to add.');
  }
}

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListElement();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendItemToShoppingListElement(currentItem);
    }
  } else {
    shoppingListElement.innerHTML = '<li>No items here... yet</li>';
  }
});

function clearShoppingListElement() {
  shoppingListElement.innerHTML = '';
}

function clearInputFieldElement() {
  inputFieldElement.value = '';
}

function appendItemToShoppingListElement(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newElement = document.createElement('li');
  newElement.textContent = itemValue;

  newElement.addEventListener('dblclick', itemClicked);

  function itemClicked() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  }

  shoppingListElement.append(newElement);
}
