import * as github from '@actions/github';
import * as core from '@actions/core';
import * as dotenv from 'dotenv';

const env = dotenv.config();

async function main() {
  try {
    console.log('Hello World!');
  } catch(error) {
    console.log(error);
  }
}

main();
