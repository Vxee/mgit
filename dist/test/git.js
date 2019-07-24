"use strict";

var _git = require("../src/git");

var _git2 = _interopRequireDefault(_git);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_git2.default);
const git = new _git2.default("../../../../guang-admin-node");
git.init();
console.log("test!!!");