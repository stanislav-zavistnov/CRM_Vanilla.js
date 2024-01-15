// creates a table of DOM elements referring to objects from the server
// with buttons and eventlistenners

import deleteWindow from "./deleteClient.js";
import changeClient from "./changeClient.js";
import { getServerRecord } from "./api.js";

export default function addClientToDOM(objectClient, container) {
  // <ul class="client-list list-reset">
  const clientList = document.createElement('tr');
  clientList.classList.add('client-list', 'list-reset');

  //    <li class="client-list__item client-list__item--id">
  const clientListItemId = document.createElement('td');
  clientListItemId.classList.add('client-list__item', 'client-list__item--id');
  const clientListItemIdSpan = document.createElement('span');
  clientListItemIdSpan.classList.add('client-list__item-opacity-text');
  if (objectClient.id) {
    clientListItemIdSpan.textContent = objectClient.id;
  }

  clientListItemId.append(clientListItemIdSpan);

  //    <li class="client-list__item client-list__item--name">
  const clientListItemName = document.createElement('td');
  clientListItemName.classList.add('client-list__item', 'client-list__item--name');
  const clientListItemNameSpan = document.createElement('span');
  clientListItemNameSpan.classList.add('client-list__item-text');
  const notFullName = `${objectClient.surname} ${objectClient.name}`;
  let fullName;
  if (objectClient.lastName) {
    fullName = `${notFullName} ${objectClient.lastName}`;
  }
  clientListItemNameSpan.textContent = fullName ? fullName : notFullName;

  clientListItemName.append(clientListItemNameSpan);

  //    <li class="client-list__item client-list__item--created">
  const clientListItemCreated = document.createElement('td');
  clientListItemCreated.classList.add('client-list__item', 'client-list__item--created');
  const clientListItemCreatedSpanDate = document.createElement('span');
  clientListItemCreatedSpanDate.classList.add('client-list__item-text');
  clientListItemCreatedSpanDate.textContent = convertDate(objectClient.createdAt);
  const clientListItemCreatedSpanTime = document.createElement('span');
  clientListItemCreatedSpanTime.classList.add('client-list__item-opacity-text');
  clientListItemCreatedSpanTime.textContent = convertTime(objectClient.createdAt);

  clientListItemCreated.append(clientListItemCreatedSpanDate, clientListItemCreatedSpanTime);

  //    <li class="client-list__item client-list__item--changed">
  const clientListItemChanged = document.createElement('td');
  clientListItemChanged.classList.add('client-list__item', 'client-list__item--changed');
  const clientListItemChangedSpanDate = document.createElement('span');
  clientListItemChangedSpanDate.classList.add('client-list__item-text');
  clientListItemChangedSpanDate.textContent = convertDate(objectClient.updatedAt);
  const clientListItemChangedSpanTime = document.createElement('span');
  clientListItemChangedSpanTime.classList.add('client-list__item-opacity-text');
  clientListItemChangedSpanTime.textContent = convertTime(objectClient.updatedAt);

  clientListItemChanged.append(clientListItemChangedSpanDate, clientListItemChangedSpanTime);

  //    <li class="client-list__item client-list__item--contacts">
  const clientListItemContacts = document.createElement('td');
  clientListItemContacts.classList.add('client-list__item', 'client-list__item--contacts');
  if (objectClient.contacts) {
    objectClient.contacts.forEach(element => {
      const contactItem = document.createElement('span');
      contactItem.classList.add('client-list__item-contact');
      contactItem.setAttribute('data-tippy-content', element.value);
      clientListItemContacts.append(contactItem);
      element.type === 'Телефон' ? contactItem.classList.add('client-list__item-contact--ph') : null;
      element.type === 'Доп. Телефон' ? contactItem.classList.add('client-list__item-contact--ph') : null;
      element.type === 'VK' ? contactItem.classList.add('client-list__item-contact--vk') : null;
      element.type === 'Facebook' ? contactItem.classList.add('client-list__item-contact--fb') : null;
      element.type === 'Email' ? contactItem.classList.add('client-list__item-contact--ml') : null;
    });
  }

  //    <li class="client-list__item client-list__item--actions">
  const clientListItemActions = document.createElement('td');
  clientListItemActions.classList.add('client-list__item', 'client-list__item--actions');
  const clientListBtnChange = document.createElement('button');
  clientListBtnChange.classList.add('client-list__item-btn', 'client-list__item-btn--change', 'btn-reset');
  clientListBtnChange.textContent = 'Изменить';
  const clientListBtnRemove = document.createElement('button');
  clientListBtnRemove.classList.add('client-list__item-btn', 'client-list__item-btn--remove', 'btn-reset');
  clientListBtnRemove.textContent = 'Удалить';

  clientListItemActions.append(clientListBtnChange, clientListBtnRemove);

  // appending all into <ul>
  clientList.append(clientListItemId, clientListItemName, clientListItemCreated, clientListItemChanged, clientListItemContacts, clientListItemActions);
  container.append(clientList);

  // EVENTLISTENNERS

  // delete client button click
  clientListBtnRemove.addEventListener('click', (event) => {
    event.preventDefault();
    const parentLi = event.target.parentNode;
    const parentUl = parentLi.parentNode;
    const firstChildUl = parentUl.firstElementChild;
    const targetElement = firstChildUl.querySelector('.client-list__item-opacity-text');
    const clientId = targetElement.textContent;
    deleteWindow(clientId);
  });

  // change client button click
  clientListBtnChange.addEventListener('click', async (event) => {
    event.preventDefault();
    const parentLi = event.target.parentNode;
    const parentUl = parentLi.parentNode;
    const firstChildUl = parentUl.firstElementChild;
    const targetElement = firstChildUl.querySelector('.client-list__item-opacity-text');
    const clientId = targetElement.textContent;
    const client = await getServerRecord(clientId);
    changeClient(client);
    // eslint-disable-next-line no-undef
    tippy('[data-tippy-content]');
  });
}

// converts the date and time from the "new date" format to the required one according to the layout
function convertDate(currentDate) {
  const date = new Date(currentDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function convertTime(currentDate) {
  const date = new Date(currentDate);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
