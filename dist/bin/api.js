#! /usr/bin/env node
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const program = require("commander");
const Git = require("../src/git");
const git = new Git();

program.command("co <branch>").description("切换到某个分支，本地不存在时会尝试切换到远程分支").action((() => {
  var _ref = _asyncToGenerator(function* (branch) {
    try {
      yield git.checkout(branch, branch);
    } catch (e) {
      console.log(e);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());