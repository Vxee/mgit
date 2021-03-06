#! /usr/bin/env node
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const program = require("commander");
const Git = require("../src/git");
const chalk = require("chalk");
const git = new Git();

program.command("co <branch>").description("切换到某个分支，本地不存在时会尝试切换到远程分支").action((() => {
  var _ref = _asyncToGenerator(function* (branch) {
    console.log(branch);
    try {
      yield git.checkout(branch, branch);
    } catch (e) {
      const remoteBranch = "remotes/origin/" + branch;
      git.fetch(remoteBranch).then(function () {
        git.checkout(remoteBranch, branch).catch(function (e) {
          console.log(chalk.red(`分支 ${branch} 不存在`));
        });
      }).catch(function () {
        console.log(chalk.red(`无法切换到分支 ${branch}`));
      });
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

program.version("0.0.1");

program.command("update [branch]").description("更新最新的分支代码，默认是 master").action((() => {
  var _ref2 = _asyncToGenerator(function* (targetBranch = "master") {
    console.log(targetBranch);
    const branch = yield git.pull(targetBranch);
    console.log(branch);
  });

  return function () {
    return _ref2.apply(this, arguments);
  };
})());

program.command("bname").description("获取当前分支的名称").action(_asyncToGenerator(function* () {
  const name = yield git.branch();
  console.log(name);
}));

program.command("opush").description("在远程创建分支，并推送本地分支到远程").action(_asyncToGenerator(function* () {
  try {
    const currentBranchName = yield git.branch();
    git.useRaw(["push", "-u", "origin", currentBranchName], function (msg, result) {
      console.log(chalk.green(`分支${currentBranchName}推送成功！`));
    });
  } catch (e) {
    console.log(e);
    console.log(chalk.red(`分支${currentBranchName}推送失败`));
  }
}));

git.init().then(() => program.parse(process.argv));