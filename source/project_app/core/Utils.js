export function copyObj(mainObj) {
  let objCopy = {}; // objCopy будет хранить копию mainObj
  let key;

  for (key in mainObj) {
    objCopy[key] = mainObj[key]; // копирует каждое свойство objCopy
  }
  return objCopy;
}

export function cs(...classes) {
  return classes.filter(v => v !== null).join(' ');
}

export function isIphone() {
  return (/iPhone|iPad|iPod/i).test(window.navigator.userAgent) || true;
}

let time_offset = 0;

export function getUTC() {
  return Date.now() + time_offset;
};

export function setUTC(utc) {
  time_offset = utc - Date.now();
}