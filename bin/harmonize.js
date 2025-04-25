#!/usr/bin/env node
const instance = require('../lib/manager_instance'); 
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];
const processName = args[1];

switch (command) {
    case 'start':
        const pathFile = args[2];
        if (!processName || !pathFile) {
            console.log('❌ Wrong command. Use: harmonize start <process_name> <path_file>');
        }else{
            instance.start(processName, pathFile);
        }
        break;

    case 'stop':
        if (!processName) {
            console.log('❌ Wrong command. Use: harmonize stop <process_name>');
        }
        else {
            instance.stop(processName);
        }
        break;

    case 'status':
        if (!processName) {
            console.log('❌ Wrong command. Use: harmonize status <process_name>');
        }
        else {
            instance.status(processName);
        }
        break;
    
    case 'list':
        instance.list();
        break;
    
    case 'dashboard':
        require('../src/server');
        break;
    
    case 'docker':
        instance.dockerList();
        break;

    default:
        console.log('❓ Be sure you are using the corrects commands:');
        console.log('  harmonize start <name> <path_file>');
        console.log('  harmonize stop <name>');
        console.log('  harmonize status <name>');
        break;
}