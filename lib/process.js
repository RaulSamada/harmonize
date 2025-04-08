class Process {
    constructor(name, path, pid) {
      this.name = name;
      this.path = path;
      this.pid = pid;
      this.startedAt = new Date().toISOString();
    }
}
module.exports = Process;