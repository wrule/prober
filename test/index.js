const path = require('path');
const { Prober } = require('../dist');
const rspData = require('./1.json');

const prober = new Prober();
const field = prober.Do(rspData.object, 'rsp', path.join(__dirname, 'output'));
console.log(field);
