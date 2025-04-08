const ProcessManager = require('./process_manager');

class Manager {
    constructor() {
        if (!Manager.instance) {
            Manager.instance = new ProcessManager();
        }
        return Manager.instance;
    }
}

const manager = new Manager();
module.exports = manager;