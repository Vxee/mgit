const SimpleGit = require("simple-git");
const trim = require("lodash/trim");
import Storage from "./common/storage";

const BRANCH_HISTORY = "branch_history";

class Git {
  constructor(dir = process.cwd()) {
    this.git = new SimpleGit(dir);
    this.storage = new Storage("git");
  }

  async checkIsRepo() {
    return new Promise((resolve, reject) => {
      this.git.checkIsRepo((msg, res) => {
        if (!res) {
          reject();
        }
        resolve();
      });
    });
  }

  async init() {
    await this.checkIsRepo().catch(() => {
      console.error("Current dir is not a git repository!!!");
      process.exit();
    });
    console.log("is repo");
    this.branchHistories = this.storage.get(BRANCH_HISTORY) || {};
    this.name = await this.getRepositoryName();
    if (!this.branchHistories[this.name]) {
      this.branchName = await this.branch();
      this.branchHistories[this.name] = [this.branchName];
      this.storage.set(BRANCH_HISTORY, this.branchHistories);
    }
    console.log("git init");
  }

  pushBranchHistory(branchName) {
    this.branchHistories[this.name].push(branchName);
    this.storage.set(BRANCH_HISTORY, this.branchHistories);
  }

  listBranchHistory() {
    console.log(this.branchHistories);
  }

  checkoutBack(step) {
    if (step <= 0) {
      return;
    }
    console.log(this.branchHistories);
    const history = this.branchHistories[this.name];
    const branchName = history[history.length - step - 1];
    this.checkout(branchName, branchName);
  }

  async push(branch) {
    return new Promise((resolve, reject) => {
      this.git.push("origin", branch, (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async diffSummary() {
    return new Promise((resolve, reject) => {
      this.git.diffSummary((msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async branch() {
    return new Promise((resolve, reject) => {
      this.git.branch({}, (msg, branchInfo) => {
        msg && reject(msg);
        resolve(branchInfo.current);
      });
    });
  }

  async localBranches() {
    return new Promise((resolve, reject) => {
      this.git.branchLocal((msg, branchInfo) => {
        msg && reject(msg);
        resolve(branchInfo);
      });
    });
  }

  async pull(branch = "master") {
    return new Promise((resolve, reject) => {
      this.git.pull("origin", branch, (msg, pullInfo) => {
        msg && reject(msg);
        resolve(pullInfo);
      });
    });
  }

  async stash(options = {}) {
    return new Promise((resolve, reject) => {
      const { pop = false } = options;
      const params = [];
      pop && params.push("pop");
      this.git.stash(params, (msg, res) => {
        msg && reject(msg);
        if (res && res.indexOf("Saved") !== -1) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  async deleteLocal(branch) {
    return new Promise((resolve, reject) => {
      this.git.deleteLocalBranch(branch, (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async deleteLocalForce(branch) {
    return new Promise((resolve, reject) => {
      this.git.raw(["branch", "-D", branch], (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async checkout(options, branchName) {
    return new Promise((resolve, reject) => {
      if (!options) {
        reject("no params");
      }
      this.git.checkout(options, (msg, result) => {
        msg && reject(msg);
        if (branchName) {
          this.branchName = branchName;
          this.pushBranchHistory(branchName);
        }
        resolve(result);
      });
    });
  }

  async fetch(branch, remote = "origin") {
    return new Promise((resolve, reject) => {
      this.git.fetch(remote, branch, (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async add(options) {
    return new Promise((resolve, reject) => {
      this.git.add(options, (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async commit(msg) {
    return new Promise((resolve, reject) => {
      this.git.commit(msg, (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async merge(branchName) {
    return new Promise((resolve, reject) => {
      if (!branchName) {
        reject();
      }
      this.git.raw(["merge", branchName], (msg, result) => {
        msg && reject(msg);
        resolve(result);
      });
    });
  }

  async getUserName() {
    return new Promise((resolve, reject) => {
      this.git.raw(["config", "user.name"], (msg, result) => {
        msg && reject(msg);
        resolve(trim(result));
      });
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      this.stash()
        .then(() => {
          this.pull().then(() => {
            this.stash({ pop: true });
          });
        })
        .catch(() => {
          this.pull();
        });
    });
  }

  async getRepositoryName() {
    return new Promise((resolve, reject) => {
      this.git.raw(["config", "remote.origin.url"], (msg, result) => {
        msg && reject(msg);
        const pattern = /\/(.+).git/;
        result = pattern.exec(result);
        if (!result) {
          console.error("get repository name failed");
        }
        resolve(result[1]);
      });
    });
  }
}

module.exports = Git;
