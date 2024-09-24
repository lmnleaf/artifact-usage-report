import * as github from '@actions/github';
import * as core from '@actions/core';
import * as dotenv from 'dotenv';
import { artifactUsageReport } from './src/artifact-report.js';

const env = dotenv.config();
const token = process.env.GITHUB_TOKEN;
const owner = process.env.OWNER;
const repo = process.env.REPO;

async function main() {
  try {
    const octokit = new github.getOctokit(token);
    const currentPeriodDays = 7;
    const path = './';

    await artifactUsageReport.createReport(currentPeriodDays, path, repo, owner, octokit);
  } catch(error) {
    console.log(error);
  }
}

main();
