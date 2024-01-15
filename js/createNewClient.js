/* window 'create client' with full logic (all listenners of buttons and forms) */

import { playAnimation, reverseAnimation } from "./gsapAnimations.js";
import { createServerRecord, refreshTable } from "./api.js";
import { initializeSelect } from "./select.js";

export default function createNewClient() {
  const blurWindow = document.querySelector('.blur-window');
  // line 11-72 create DOM element with all buttons and forms
  let objectClient;
  // <div class="create-client">
  const createClient = document.createElement('div');
  createClient.classList.add('create-client', 'custom-scroll');

  //    <div class="create-client__header">
  const createClientHeader = document.createElement('div');
  createClientHeader.classList.add('create-client__header');

  const createTitle = document.createElement('h2');
  createTitle.classList.add('create-title');
  createTitle.textContent = 'Новый клиент';

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn', 'btn-reset');

  createClientHeader.append(createTitle, closeBtn);

  //    <form class="create-form">
  const createForm = document.createElement('form');
  createForm.classList.add('create-form');

  const createInputSurname = document.createElement('input');
  createInputSurname.classList.add('create-form-input', 'create-form-input--surname');
  createInputSurname.placeholder = 'Фамилия *';
  createInputSurname.type = 'text';

  const createInputName = document.createElement('input');
  createInputName.classList.add('create-form-input', 'create-form-input--name');
  createInputName.placeholder = 'Имя *';
  createInputName.type = 'text';

  const createInputLastname = document.createElement('input');
  createInputLastname.classList.add('create-form-input', 'create-form-input--lastname');
  createInputLastname.placeholder = 'Отчество';
  createInputLastname.type = 'text';

  createForm.append(createInputSurname, createInputName, createInputLastname);

  //    <div class="add-contact">
  const addContact = document.createElement('div');
  addContact.classList.add('add-contact');
  const addContactButton = document.createElement('button');
  addContactButton.textContent = 'Добавить контакт';
  addContactButton.classList.add('add-contact__btn', 'btn-reset');

  addContact.append(addContactButton);

  //    <div class="save-cancel-buttons">
  const saveCancelButtons = document.createElement('div');
  saveCancelButtons.classList.add('save-cancel-buttons');
  const saveButton = document.createElement('button');
  saveButton.classList.add('save-btn', 'btn-reset');
  saveButton.textContent = 'Сохранить';
  const cancelButton = document.createElement('button');
  cancelButton.classList.add('cancel-btn', 'btn-reset');
  cancelButton.textContent = 'Отмена';

  saveCancelButtons.append(saveButton, cancelButton);

  // finaly window append
  createClient.append(createClientHeader, createForm, addContact, saveCancelButtons);

  // EventListenners
  //    для кнопки "добавить контакт"
  // add contact
  addContactButton.addEventListener('click', (event) => {
    event.preventDefault();
    addClientContact(addContact);
    // работа кнопки после поля ввода (удалить эту форму)
    const inputElements = document.querySelectorAll('.add-contact__form-input');
    const removeContactButtons = document.querySelectorAll('.add-contact__form-btn');

    // это чтобы если в инпуте что-то было появлялся крестик, чтобы удалить поле целиком
    // appear remove button if input not empty. Removing DOM of contact, not input value!!!
    inputElements.forEach((input) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length !== 0) {
          e.target.nextElementSibling.style.display = 'block';
          // eslint-disable-next-line no-undef
          tippy('[data-tippy-content]');
        } else {
          e.target.nextElementSibling.style.display = 'none';
        }
      });
    });
    removeContactButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const parent = btn.parentNode;
        parent.remove();
      });
    });
  });

  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    reverseAnimation(createClient, blurWindow)
  });

  closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    reverseAnimation(createClient, blurWindow)
  });

  saveButton.addEventListener('click', async (event) => {
    event.preventDefault();
    // Remove previous error messages
    if (document.querySelector('.error-message')) {
      const errorMessages = document.querySelectorAll('.error-message');
      for (const iterator of errorMessages) {
        iterator.remove();
      }
    }
    const newClient = {
      name: createInputName.value,
      surname: createInputSurname.value,
      lastName: createInputLastname.value,
      contacts: [],
    }
    // if there are filled contacts, then write them to the object
    if (document.querySelector('.add-contact__form')) {
      const allForms = document.querySelectorAll('.add-contact__form');
      allForms.forEach((form) => {
        const selectValue = form.querySelector('.add-contact__form-select').value;
        const inputValue = form.querySelector('.add-contact__form-input').value;
        const contact = { type: selectValue, value: inputValue };
        if (inputValue) {
          newClient.contacts.push(contact);
        }
        for (let i = 0; i < newClient.contacts.length; i++) {
          for (let j = i + 1; j < newClient.contacts.length; j++) {
            if (
              newClient.contacts[i].type === newClient.contacts[j].type &&
              newClient.contacts[i].value === newClient.contacts[j].value
            ) {
              newClient.contacts.splice(j, 1);
              j--;
            }
          }
        }
      });
    }

    objectClient = newClient;
    // check if the required fields are filled in by requesting the server
    const response = await createServerRecord(objectClient);
    if (response.name && response.surname) {
      reverseAnimation(createClient, blurWindow);
      refreshTable();
    } else {
      response.errors.forEach(element => {
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = element.message;
        saveCancelButtons.prepend(errorMessage);
      });
    }
  });

  playAnimation(createClient, blurWindow);
  document.body.prepend(createClient);
  return objectClient;
}

// создание формы контакта
// create DOM element contact form with listenner
function addClientContact(container) {
  const form = document.createElement('form');
  const select = document.createElement('select');
  const optionPhone = document.createElement('option');
  const optionAnotherPhone = document.createElement('option');
  const optionMail = document.createElement('option');
  const optionVk = document.createElement('option');
  const optionFacebook = document.createElement('option');
  const input = document.createElement('input');
  const clearButton = document.createElement('btn');
  // присваивание нужных классов
  form.classList.add('add-contact__form');
  select.classList.add('add-contact__form-select');
  input.classList.add('add-contact__form-input');
  clearButton.classList.add('add-contact__form-btn', 'btn-reset');
  clearButton.setAttribute('data-tippy-content', 'Удалить контакт');
  clearButton.style.display = 'none';
  input.placeholder = 'Введите данные контакта';

  // константы строковых значений
  const tel = 'Телефон';
  const addTel = 'Доп. Телефон';
  const eMail = 'Email';
  const vK = 'VK';
  const facebook = 'Facebook';

  // textContent тегов option
  optionPhone.textContent = tel;
  optionAnotherPhone.textContent = addTel;
  optionMail.textContent = eMail;
  optionVk.textContent = vK;
  optionFacebook.textContent = facebook;

  // аппендим все
  select.append(optionPhone, optionAnotherPhone, optionMail, optionVk, optionFacebook);
  form.append(select, input, clearButton);
  container.insertBefore(form, container.lastChild);
  initializeSelect();
}
