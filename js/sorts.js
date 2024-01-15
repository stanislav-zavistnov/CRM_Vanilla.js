// functions for sorting arrays by different properties (Ascending \ Descending)

export function sortIdAsc(array) {
  return array.sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

export function sortIdDes(array) {
  return array.sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function sortByNameAsc(array) {
  array.sort((a, b) => {
      const nameA = `${a.surname} ${a.name} ${a.lastName}`.trim();
      const nameB = `${b.surname} ${b.name} ${b.lastName}`.trim();
      return nameA.localeCompare(nameB);
  });
  return array;
}

export function sortByNameDes(array) {
  array.sort((a, b) => {
      const nameA = `${a.surname} ${a.name} ${a.lastName}`.trim();
      const nameB = `${b.surname} ${b.name} ${b.lastName}`.trim();
      return nameB.localeCompare(nameA);
  });
  return array;
}

export function sortDateAsc(array, type) {
  return array.sort((a, b) => new Date(a[type]) - new Date(b[type]));
}

export function sortDateDes(array, type) {
  return array.sort((a, b) => new Date(b[type]) - new Date(a[type]));
}
