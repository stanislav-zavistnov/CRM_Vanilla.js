/* window 'change client' with full logic (all listenners of buttons and forms) */

import { playAnimation, reverseAnimation } from "./gsapAnimations.js";
import { deleteServerRecord, patchServerRecord, refreshTable } from "./api.js";
import { initializeSelect } from "./select.js";


export default function changeClient(client) {
  const blurWindow = document.querySelector('.blur-window');
  // line 12-81 create DOM element with all buttons and forms
  //  <div class="change-client">
  const changeClient = document.createElement('div');
  changeClient.classList.add('change-client', 'custom-scroll');

  //    <div class="change-client__header">
  const changeClientHeader = document.createElement('div');
  changeClientHeader.classList.add('change-client__header');
  const changeTitle = document.createElement('h2');
  changeTitle.classList.add('change-title');
  changeTitle.textContent = 'Изменить данные';
  const changeId = document.createElement('span');
  changeId.classList.add('change-id');
  changeId.textContent = client.id;
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-btn', 'btn-reset');

  changeClientHeader.append(changeTitle, changeId, closeButton);

  //    <form class="change-form">
  const changeForm = document.createElement('form');
  changeForm.classList.add('change-form');
  const placeholdersurname = document.createElement('span');
  placeholdersurname.classList.add('change-form__placeholder', 'change-form__placeholder--surname');
  placeholdersurname.textContent = 'Фамилия*';
  const inputSurname = document.createElement('input');
  inputSurname.classList.add('create-form-input', 'create-form-input--surname');
  inputSurname.value = client.surname;
  const placeholderName = document.createElement('span');
  placeholderName.classList.add('change-form__placeholder', 'change-form__placeholder--name');
  placeholderName.textContent = 'Имя*';
  const inputName = document.createElement('input');
  inputName.classList.add('create-form-input', 'create-form-input--name');
  inputName.value = client.name;
  const placeholderLastName = document.createElement('span');
  placeholderLastName.classList.add('change-form__placeholder', 'change-form__placeholder--lastname');
  placeholderLastName.textContent = 'Отчество*';
  const inputLastName = document.createElement('input');
  inputLastName.classList.add('create-form-input', 'create-form-input--lastname');
  inputLastName.value = client.lastName;

  changeForm.append(placeholdersurname, inputSurname, placeholderName, inputName, placeholderLastName, inputLastName);

  //    <div class="add-contact">
  const addContact = document.createElement('div');
  addContact.classList.add('add-contact');
  const addContactButton = document.createElement('button');
  addContactButton.textContent = 'Добавить контакт';
  addContactButton.classList.add('add-contact__btn', 'btn-reset');

  addContact.append(addContactButton);

  if (client.contacts.length) {
    for (const iterator of client.contacts) {
      addClientContact(addContact, iterator.type, iterator.value);
    }
  }
  //    <div class="save-cancel-buttons">
  const saveCancelButtons = document.createElement('div');
  saveCancelButtons.classList.add('save-cancel-buttons');
  const saveButton = document.createElement('button');
  saveButton.classList.add('save-btn', 'btn-reset');
  saveButton.textContent = 'Сохранить';
  const removeButton = document.createElement('button');
  removeButton.classList.add('cancel-btn', 'btn-reset');
  removeButton.textContent = 'Удалить';

  saveCancelButtons.append(saveButton, removeButton);

  // finaly window append
  changeClient.append(changeClientHeader, changeForm, addContact, saveCancelButtons);


  // EVENTLISTENNRS
  // add contact
  addContactButton.addEventListener('click', (event) => {
    event.preventDefault();
    addClientContact(addContact);

    const inputElements = document.querySelectorAll('.add-contact__form-input');
    const removeContactButtons = document.querySelectorAll('.add-contact__form-btn');
    // это чтобы если в инпуте что-то было появлялся крестик, чтобы удалить поле целиком
    // appear remove button if input not empty. Removing DOM of contact, not input value!!!
    inputElements.forEach((input) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length !== 0) {
          e.target.nextElementSibling.style.display = 'block';
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


  saveButton.addEventListener('click', async (event) => {
    event.preventDefault();
    // Remove previous error messages
    if (document.querySelector('.error-message')) {
      const errorMessages = document.querySelectorAll('.error-message');
      for (const iterator of errorMessages) {
        iterator.remove();
      }
    }

    // delete contacts, because the object creates new ones that we see in the window
    client.contacts.splice(0);
    patchServerRecord(client, client.id);
    const newClient = {
      name: inputName.value,
      surname: inputSurname.value,
      lastName: inputLastName.value,
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

    const objectClient = newClient;
    const response = await patchServerRecord(objectClient, client.id);
    // check if the required fields are filled in by requesting the server
    if (response.name && response.surname) {
      reverseAnimation(changeClient, blurWindow);
      refreshTable();
    } else {
      console.log(response);
      response.errors.forEach(element => {
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = element.message;
        saveCancelButtons.prepend(errorMessage);
      });
    }
  });

  // delete client
  removeButton.addEventListener('click', (event) => {
    event.preventDefault();
    deleteServerRecord(client.id);
    reverseAnimation(changeClient, blurWindow);
  });

  // close window without saving
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    reverseAnimation(changeClient, blurWindow)
  });

  // GSAP - opening window with animation
  playAnimation(changeClient, blurWindow);
  document.body.prepend(changeClient);
}

// создание формы контакта
// create DOM element contact form with listenner
function addClientContact(container, type = null, value = null) {
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

  if (type && value) {
    if (type === tel || type === addTel || type === eMail || type === vK || type === facebook) {
      select.value = type;
      input.value = value;
      clearButton.style.display = 'block';
    }
  }

  // appear remove button if input not empty. Removing DOM of contact, not input value!!!
  input.addEventListener('input', () => {
    if (input.value) {
      clearButton.style.display = 'block';
      // eslint-disable-next-line no-undef
      tippy('[data-tippy-content]');
    } else {
      clearButton.style.display = 'none';
    }
  })

  clearButton.addEventListener('click', () => {
    const parent = clearButton.parentNode;
    parent.remove();
  });
  initializeSelect();
}
