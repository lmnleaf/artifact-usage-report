import * as github from '@actions/github';
import * as core from '@actions/core';
import * as dotenv from 'dotenv';
import { repoArtifacts } from './src/repo-artifacts.js';

const env = dotenv.config();
const token = process.env.GITHUB_TOKEN;
const owner = process.env.OWNER;
const repo = process.env.REPO;

async function main() {
  try {
    const octokit = new github.getOctokit(token);
    const totalDays = 7;

    const artifacts = await repoArtifacts.getArtifacts(totalDays, repo, owner, octokit);

    console.log('Artifacts:', artifacts);
  } catch(error) {
    console.log(error);
  }
}

main();
