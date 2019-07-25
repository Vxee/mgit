#! /usr/bin/env node
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const program = require("commander");
const Git = require("../src/git");
const chalk = require("chalk");
const git = new Git("/Users/fujialing/work/guang-admin-node");

const _warn = chalk.keyword("orange");
const _error = chalk.keyword("red");

program.command("co <branch>").description("切换到某个分支，本地不存在时会尝试切换到远程分支").action((() => {
  var _ref = _asyncToGenerator(function* (branch) {
    console.log(branch);
    try {
      yield git.checkout(branch, branch);
    } catch (e) {
      git.fetch(branch).then(function () {
        git.checkout(branch, branch).catch(function (e) {
          console.log(e);
          console.log(_warn(`无法切换到分支 ${branch}`));
        });
      }).catch(function () {
        console.log(chalk.red(`分支 ${branch} 不存在`));
      });
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

program.version("0.0.1");
program.option("-n, --name <name>", "your name", "GK");

program.command("hello").description("hello").action(() => {
  console.log("test");
});

program.parse(process.argv);

git.init().then(() => program.parse(process.argv));