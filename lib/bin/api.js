#! /usr/bin/env node
const program = require("commander");
const Git = require("../src/git");
const git = new Git();

program
  .command("co <branch>")
  .description("切换到某个分支，本地不存在时会尝试切换到远程分支")
  .action(async branch => {
    try {
      await git.checkout(branch, branch);
    } catch (e) {
      console.log(e);
    }
  });
