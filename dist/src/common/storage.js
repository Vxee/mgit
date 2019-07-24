'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const nodeStorage = require('node-localstorage');

const { LocalStorage } = nodeStorage;

class Storage {
  constructor(key, path = __dirname) {
    if (!Storage.store) {
      Storage.store = new LocalStorage(path);
    }
    this.key = key;
    this.data = this.all();
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  get(key) {
    return this.data[key];
  }

  save() {
    Storage.store.setItem(this.key, JSON.stringify(this.data));
  }

  all() {
    let data = Storage.store.getItem(this.key);
    data = data ? JSON.parse(data) : {};
    return data;
  }

}
exports.default = Storage;