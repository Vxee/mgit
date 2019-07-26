#! /usr/bin/env node
const program = require("commander");
const Git = require("../src/git");
const chalk = require("chalk");
const git = new Git();

const _warn = chalk.keyword("orange");
const _error = chalk.keyword("red");

program
  .command("co <branch>")
  .description("切换到某个分支，本地不存在时会尝试切换到远程分支")
  .action(async branch => {
    console.log(branch);
    try {
      await git.checkout(branch, branch);
    } catch (e) {
      const remoteBranch = "remotes/origin/" + branch;
      git
        .fetch(remoteBranch)
        .then(() => {
          git.checkout(remoteBranch, branch).catch(e => {
            console.log(chalk.red(`分支 ${branch} 不存在`));
          });
        })
        .catch(() => {
          console.log(chalk.red(`无法切换到分支 ${branch}`));
        });
    }
  });

program.version("0.0.1");

program
  .command("update [branch]")
  .description("更新最新的分支代码，默认是 master")
  .action(async (targetBranch = "master") => {
    console.log(targetBranch);
    const branch = await git.pull(targetBranch);
    console.log(branch);
  });

program
  .command("opush")
  .description("在远程创建分支，并推送本地分支到远程")
  .action(async () => {
    try {
      // await git.push('origin', '');
      const currentBranchName = await git.branch({}, (msg, branchInfo) => {
        msg && reject(msg);
        resolve(branchInfo.current);
      });
      console.log(currentBranchName);
      git.useRaw(["push", "-u", "origin", currentBranchName], (msg, result) => {
        console.log(msg);
        msg && reject(msg);
        resolve(result);
      });
    } catch (e) {
      console.log(e);
      console.log(chalk.red(`分支推送失败`));
    }
  });

program.parse(process.argv);

git.init().then(() => program.parse(process.argv));
