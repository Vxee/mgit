"use strict";

var _storage = require("./common/storage");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const SimpleGit = require("simple-git");
const trim = require("lodash/trim");


const BRANCH_HISTORY = "branch_history";

class Git {
  constructor(dir = process.cwd()) {
    this.git = new SimpleGit(dir);
    this.storage = new _storage2.default("git");
  }

  useRaw(args, fn) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this.git.raw(args, fn);
    })();
  }

  checkIsRepo() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this2.git.checkIsRepo(function (msg, res) {
          if (!res) {
            reject();
          }
          resolve();
        });
      });
    })();
  }

  init() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3.checkIsRepo().catch(function () {
        console.error("Current dir is not a git repository!!!");
        process.exit();
      });
      _this3.branchHistories = _this3.storage.get(BRANCH_HISTORY) || {};
      _this3.name = yield _this3.getRepositoryName();
      console.log("repoName: " + _this3.name);
      if (!_this3.branchHistories[_this3.name]) {
        _this3.branchName = yield _this3.branch();
        _this3.branchHistories[_this3.name] = [_this3.branchName];
        _this3.storage.set(BRANCH_HISTORY, _this3.branchHistories);
      }
      console.log("git init success!");
    })();
  }

  pushBranchHistory(branchName) {
    console.log(this.branchHistories, this.name);
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

  push(branch) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this4.git.push("origin", branch, function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  diffSummary() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this5.git.diffSummary(function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  branch() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this6.git.branch({}, function (msg, branchInfo) {
          msg && reject(msg);
          resolve(branchInfo.current);
        });
      });
    })();
  }

  localBranches() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this7.git.branchLocal(function (msg, branchInfo) {
          msg && reject(msg);
          resolve(branchInfo);
        });
      });
    })();
  }

  pull(branch = "master") {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this8.git.pull("origin", branch, function (msg, pullInfo) {
          msg && reject(msg);
          resolve(pullInfo);
        });
      });
    })();
  }

  stash(options = {}) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        const { pop = false } = options;
        const params = [];
        pop && params.push("pop");
        _this9.git.stash(params, function (msg, res) {
          msg && reject(msg);
          if (res && res.indexOf("Saved") !== -1) {
            resolve(true);
          }
          resolve(false);
        });
      });
    })();
  }

  deleteLocal(branch) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this10.git.deleteLocalBranch(branch, function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  deleteLocalForce(branch) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this11.git.raw(["branch", "-D", branch], function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  checkout(options, branchName) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        if (!options) {
          reject("no params");
        }
        _this12.git.checkout(options, function (msg, result) {
          msg && reject(msg);
          if (branchName) {
            console.log("checkout: " + branchName);
            _this12.branchName = branchName;
            // this.pushBranchHistory(branchName);
          }
          resolve(result);
        });
      });
    })();
  }

  fetch(branch, remote = "origin") {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this13.git.fetch(remote, branch, function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  add(options) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this14.git.add(options, function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  commit(msg) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this15.git.commit(msg, function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  merge(branchName) {
    var _this16 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        if (!branchName) {
          reject();
        }
        _this16.git.raw(["merge", branchName], function (msg, result) {
          msg && reject(msg);
          resolve(result);
        });
      });
    })();
  }

  getUserName() {
    var _this17 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this17.git.raw(["config", "user.name"], function (msg, result) {
          msg && reject(msg);
          resolve(trim(result));
        });
      });
    })();
  }

  update() {
    var _this18 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this18.stash().then(function () {
          _this18.pull().then(function () {
            _this18.stash({ pop: true });
          });
        }).catch(function () {
          _this18.pull();
        });
      });
    })();
  }

  getRepositoryName() {
    var _this19 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this19.git.raw(["config", "remote.origin.url"], function (msg, result) {
          msg && reject(msg);
          const pattern = /\/(.+).git/;
          result = pattern.exec(result);
          if (!result) {
            console.error("get repository name failed");
          }
          resolve(result[1]);
        });
      });
    })();
  }

  getCurrentBranchName() {}
}

module.exports = Git;