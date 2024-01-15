// start application

import createNewClient from "./createNewClient.js";
import { loader } from "./api.js";
import addClientToDOM from "./clientDOM.js";
import { sortIdAsc, sortIdDes, sortByNameAsc, sortByNameDes, sortDateAsc, sortDateDes } from "./sorts.js";

const addClientButton = document.querySelector('.section-table__btn');
const tableWrap = document.querySelector('.table-wrap');
const sortIdButton = document.querySelector('.js-sort-id');
const sortNameButton = document.querySelector('.js-sort-name');
const sortCreatedButton = document.querySelector('.js-sort-created');
const sortChangedButton = document.querySelector('.js-sort-changed');
const searchInput = document.querySelector('.header-input');

// application launch function. downloading all objects from the server and rendering them
async function startApplication(container) {
  const allClients = await loader();
  const sortedIdAllClient = sortIdAsc(allClients);
  sortedIdAllClient.forEach(element => {
    addClientToDOM(element, container);
  });
  // eslint-disable-next-line no-undef
  tippy('[data-tippy-content]');
  // SORT EVENT LISTENNERS
  sortIdButton.addEventListener('click', async () => {
    if (sortIdButton.classList.contains('section-table-nav__item-btn--arrow-up')) {
      const allClients = await loader();
      const sortedIdAllClient = sortIdDes(allClients);
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortIdButton.classList.remove('section-table-nav__item-btn--arrow-up');
      sortIdButton.classList.add('section-table-nav__item-btn--arrow-down');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    } else {
      const allClients = await loader();
      const sortedIdAllClient = sortIdAsc(allClients);
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortIdButton.classList.remove('section-table-nav__item-btn--arrow-down');
      sortIdButton.classList.add('section-table-nav__item-btn--arrow-up');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    }
  });

  sortNameButton.addEventListener('click', async () => {
    const spanDirection = document.querySelector('.section-table-nav__item-btn-text--name');
    if (sortNameButton.classList.contains('section-table-nav__item-btn--arrow-up')) {
      const allClients = await loader();
      const sortedNameAllClient = sortByNameDes(allClients);
      tableWrap.textContent = '';
      sortedNameAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortNameButton.classList.remove('section-table-nav__item-btn--arrow-up');
      sortNameButton.classList.add('section-table-nav__item-btn--arrow-down');
      spanDirection.textContent = 'Я-А';
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    } else {
      const allClients = await loader();
      const sortedNameAllClient = sortByNameAsc(allClients);
      tableWrap.textContent = '';
      sortedNameAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortNameButton.classList.remove('section-table-nav__item-btn--arrow-down');
      sortNameButton.classList.add('section-table-nav__item-btn--arrow-up');
      spanDirection.textContent = 'А-Я';
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    }
  });

  sortCreatedButton.addEventListener('click', async () => {
    if (sortCreatedButton.classList.contains('section-table-nav__item-btn--arrow-up')) {
      const allClients = await loader();
      const sortedIdAllClient = sortDateDes(allClients, 'createdAt');
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortCreatedButton.classList.remove('section-table-nav__item-btn--arrow-up');
      sortCreatedButton.classList.add('section-table-nav__item-btn--arrow-down');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    } else {
      const allClients = await loader();
      const sortedIdAllClient = sortDateAsc(allClients, 'createdAt');
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortCreatedButton.classList.remove('section-table-nav__item-btn--arrow-down');
      sortCreatedButton.classList.add('section-table-nav__item-btn--arrow-up');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    }
  });

  sortChangedButton.addEventListener('click', async () => {
    if (sortChangedButton.classList.contains('section-table-nav__item-btn--arrow-up')) {
      const allClients = await loader();
      const sortedIdAllClient = sortDateDes(allClients, 'updatedAt');
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortChangedButton.classList.remove('section-table-nav__item-btn--arrow-up');
      sortChangedButton.classList.add('section-table-nav__item-btn--arrow-down');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    } else {
      const allClients = await loader();
      const sortedIdAllClient = sortDateAsc(allClients, 'updatedAt');
      tableWrap.textContent = '';
      sortedIdAllClient.forEach(element => {
        addClientToDOM(element, tableWrap);
      });
      sortChangedButton.classList.remove('section-table-nav__item-btn--arrow-down');
      sortChangedButton.classList.add('section-table-nav__item-btn--arrow-up');
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    }
  });

  // search contact area
  let timeOut;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      const input = searchInput.value;
      const allClients = await loader();
      const filteredObjects = allClients.filter(item => {
        const fullName = `${item.name} ${item.surname} ${item.lastName} ${item.id}`.toLowerCase();
        return fullName.includes(input.toLowerCase());
      });
      tableWrap.textContent = '';
      if (filteredObjects.length !== 0) {
        filteredObjects.forEach(element => {
          addClientToDOM(element, tableWrap);
        });
        // eslint-disable-next-line no-undef
        tippy('[data-tippy-content]');
      } else {
        tableWrap.textContent = 'Совпадений нет';
      }
    }, 300);
  });
}

// запускаем работу приложения (отрисовываем содержимое db.json)
// start...
startApplication(tableWrap);

// add client button
addClientButton.addEventListener('click', (event) => {
  event.preventDefault();
  createNewClient();
});
