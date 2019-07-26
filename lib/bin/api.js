#! /usr/bin/env node
const program = require("commander");
const Git = require("../src/git");
const chalk = require("chalk");
const git = new Git();

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
  .command("bname")
  .description("获取当前分支的名称")
  .action(async () => {
    const name = await git.branch();
    console.log(name);
  });

program
  .command("opush")
  .description("在远程创建分支，并推送本地分支到远程")
  .action(async () => {
    try {
      const currentBranchName = await git.branch();
      git.useRaw(["push", "-u", "origin", currentBranchName], (msg, result) => {
        console.log(chalk.green(`分支${currentBranchName}推送成功！`));
      });
    } catch (e) {
      console.log(e);
      console.log(chalk.red(`分支${currentBranchName}推送失败`));
    }
  });

git.init().then(() => program.parse(process.argv));
