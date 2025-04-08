const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const pidusage = require('pidusage');
const Process = require('./process');
const DATA_PATH = path.join(__dirname, 'processes.json');

class ProcessManager {
    constructor() {
        this.processes = [];
        this._loadProcess();
    }

    start(name, pathFile){
        if(this.processes.find(p => p.name === name)){
            console.log(`❌ Process ${name} already exists.`);
            return;
        }

        const absolutePath = path.resolve(pathFile);

        const child = spawn('node', [absolutePath], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();

        const processInstance = new Process(name, absolutePath, child.pid);
        this.processes.push(processInstance);

        this._saveProcess();
        console.log(`✅ Process ${name} started with PID ${child.pid}.`);
    }

    _saveProcess(){
        fs.writeFileSync(DATA_PATH, JSON.stringify(this.processes, null, 2));
    }
    _loadProcess(){
        if(fs.existsSync(DATA_PATH)){
            const data = fs.readFileSync(DATA_PATH, 'utf8');
            try{
                this.processes = JSON.parse(data);
            }catch(e){
                console.error(`❌ Error loading processes: ${e.message}`);
            }
        }
    }

    stop(name, signal = 'SIGTERM'){
        this._loadProcess();
        const processInstance = this.processes.find(p => p.name === name);
        
        if (!processInstance){
            console.log(`❌ Process ${name} not found.`);
            return;
        }

        try{
            process.kill(processInstance.pid, signal);
            this.processes = this.processes.filter(p => p.name !== name);
            this._saveProcess();
            console.log(`✅ Process ${name} stopped.`);
        }catch(e){
            console.error(`❌ Error stopping process ${name}: ${e.message}`);
        }
    }

    status(name){
        this._loadProcess();
        const processInstance = this.processes.find(p => p.name === name);
        if (!processInstance){
            console.log(`❌ Process ${name} not found.`);
            return;
        }

        pidusage(processInstance.pid, (error, stats) => {
            if (error){
                console.error(`❌ Error getting status of process ${name}: ${error.message}`);
                return;
            }
            console.log(`📊 Stats of process ${name}:`);
            console.log(`  -CPU: ${stats.cpu.toFixed(2)}%`);
            console.log(`  -RAM: ${stats.memory / 1024 / 1024} MB`);
        });
    }

    list(){
        this._loadProcess();
        if (this.processes.length === 0){
            console.log('❌ No processes found.');
            return;
        }
        console.log('📋 List of processes:');
        this.processes.forEach(processInstance => {
            console.log(`  - ${processInstance.name} (PID: ${processInstance.pid})`);
        });
    }
}
module.exports = ProcessManager;