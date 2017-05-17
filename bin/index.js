#! /usr/bin/env node

const argv = require('yargs')
  .usage('Usage: mongo-to-elastic [options]')
  .alias('mongo-host', 'mh')
  .describe('mongo-host', 'MongoDB host')
  .alias('mongo-port', 'mp')
  .describe('mongo-port', 'MongoDB port')
  .alias('database', 'db')
  .describe('database', 'MongoDB database')
  .alias('collection', 'c')
  .describe('collection', 'MongoDB collection')
  .alias('elastic-host', 'eh')
  .describe('elastic-host', 'ElasticSearch host')
  .alias('elastic-port', 'ep')
  .describe('elastic-port', 'ElasticSearch port')
  .alias('concurrency', 'con')
  .describe('concurrency', 'Promise concurrency')
  .help().argv;

require('../lib')(argv);
