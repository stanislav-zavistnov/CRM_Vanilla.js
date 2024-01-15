// create a window warning about the removal of the client. All events:
// delete the client, close the window itself

import { playAnimation, reverseAnimation } from "./gsapAnimations.js";
import { deleteServerRecord } from "./api.js";


export default function deleteWindow(id) {
  const clientId = id;
  const blurWindow = document.querySelector('.blur-window');
  //  <div class="delete-client">
  const deleteClient = document.createElement('div');
  deleteClient.classList.add('delete-client');

  //    <div class="delete-client__header">
  const deleteClientHeader = document.createElement('div');
  deleteClientHeader.classList.add('delete-client__header');
  const deleteClientHeaderTitle = document.createElement('h2');
  deleteClientHeaderTitle.classList.add('create-title');
  deleteClientHeaderTitle.textContent = 'Удалить клиента';
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn', 'btn-reset');

  deleteClientHeader.append(deleteClientHeaderTitle, closeBtn);

  //    <p class="delete-client__descr">
  const deleteClientDescr = document.createElement('p');
  deleteClientDescr.classList.add('delete-client__descr');
  deleteClientDescr.textContent = 'Вы действительно хотите удалить данного клиента?';

  //    <div class="save-cancel-buttons">
  const seveCancelButtons = document.createElement('div');
  seveCancelButtons.classList.add('save-cancel-buttons');
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('save-btn', 'btn-reset');
  deleteButton.textContent = 'Удалить';
  const cancelButton = document.createElement('button');
  cancelButton.classList.add('cancel-btn', 'btn-reset');
  cancelButton.textContent = 'Отмена';

  seveCancelButtons.append(deleteButton, cancelButton);

  // appending into <div class="delete-client">
  deleteClient.append(deleteClientHeader, deleteClientDescr, seveCancelButtons);

  // EVENTLISTENNERS
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    reverseAnimation(deleteClient, blurWindow);
  });

  closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    reverseAnimation(deleteClient, blurWindow);
  });

  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    deleteServerRecord(clientId);
    reverseAnimation(deleteClient, blurWindow);
  });

  playAnimation(deleteClient, blurWindow);
  document.body.prepend(deleteClient);
}
