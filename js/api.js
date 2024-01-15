/* api functions for get, post, patch, delete. And function refresh, that use after request */

import addClientToDOM from "./clientDOM.js";

const SERVER_URL = 'http://localhost:3000/api/clients';

export async function createServerRecord(newClient) {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newClient)
  });
  const data = await response.json();
  return data;
}

export async function patchServerRecord(client, id) {
  const response = await fetch(`${SERVER_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  });
  const data = await response.json();
  refreshTable();
  return data;
}

export async function loader() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  return data;
}

export async function deleteServerRecord(id) {
  const response = await fetch(`${SERVER_URL}/${id}`, {
    method: 'DELETE',
  });
  // eslint-disable-next-line no-unused-vars
  const data = await response.json();
  refreshTable();
}

export async function getServerRecord(id) {
  const response = await fetch(`${SERVER_URL}/${id}`)
  const data = await response.json();
  return data;
}

export async function refreshTable() {
  const arr = await loader();
  const table = document.querySelector('.table-wrap');
  table.textContent = '';
  for (const iterator of arr) {
    addClientToDOM(iterator, table);
  }
  // eslint-disable-next-line no-undef
  tippy('[data-tippy-content]');
}
