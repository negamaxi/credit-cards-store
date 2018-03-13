// Массив с карточками

let cards = [];

function addCard (cardData) {
  cards.unshift(cardData);
}

function deleteCard (index) {
  cards.splice(index, 1);
}

// Валидация номера карты http://www.the-art-of-web.com/javascript/validate/3/

function isVisa (cardNumber) {
  const pattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  return cardNumber.match(pattern)
}

function isMasterCard (cardNumber) {
  const pattern = /^(?:5[1-5][0-9]{14})$/;
  return cardNumber.match(pattern);
}

function getCardProviderCode (number) {
  if (isVisa(number)) {
    return 0;
  } else
  if (isMasterCard(number)) {
    return 1;
  }
}

// Получшение списка карт из хранилища

function getCardsFromStorage() {
  const storageData = localStorage.getItem('cards');
  if (storageData) {
    cards = JSON.parse(storageData);
  }
};

// Сохраниение списка карт в хранилище

function saveCardsToStorage() {
  localStorage.setItem('cards', JSON.stringify(cards));
};

// Включение / выключение модального окна

function toggleAddCardModal() {
  const node = document.getElementById('add-card-modal__layer');
  const isVisible = node.classList.contains('visible');
  if (isVisible) {
    document.getElementById('add-card-modal__layer').classList.remove('visible');
  } else {
    document.getElementById('add-card-modal__layer').classList.add('visible');
  }
};

// Отрисовка списка карт

function renderCards() {
  const listNode = document.getElementById('cards-list');
  let innerHTML = '';
  if (cards.length === 0) {
    innerHTML = '<center><h2>список пуст</h2></center>';
  } else {
    function handleForEach({ number, description }, index) {
      const provider = getCardProviderCode(number);
      innerHTML += `
<div class='card__container'>
  <img
    class='card__provider-logo' 
    src='${
      provider === 0
        ? 'images/visa-logo.png'
        : 'images/mc-logo.png'
    }'
  />
  <h2 class='card__number'>${number}</h2>
  ${
    description ?
    `
<p class='card__description'>
  ${description}
</p>
    ` : ''
  }
  <hr />
  <button onclick="onDeleteCardClick(${index})">
    Удалить
  </button>
</div>
    `;
    };
    cards.forEach(handleForEach);
  };
  listNode.innerHTML = innerHTML;
}

// Обработчики событий

function onOpenAddCardModalClick () {
  toggleAddCardModal();
};

function onCloseAddCardModalClick () {
  toggleAddCardModal();
};

function onDeleteCardClick (index) {
  if (confirm('Вы уверены, что хотите удалить карту?')) {
    deleteCard(index)
    saveCardsToStorage();
    renderCards();
  }
};

function onCardFormSubmit(e) {
  e.preventDefault();
  const { number, description } = e.currentTarget
  const cardData = {
    number: number.value,
    description: description.value,
  };
  addCard(cardData);
  saveCardsToStorage();
  renderCards();
  toggleAddCardModal();
}


// Первый рендер

getCardsFromStorage();
renderCards();