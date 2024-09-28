import { repoNames } from './repo-names.js';
import { repoArtifacts } from './repo-artifacts.js';

async function getArtifactsForRepos(currentPeriodDays, repos, owner, octokit) {
  let artifacts = [];

  try {
    let names = [];
    if (repos.length === 1 && repos[0] === 'all') {
      names = await repoNames.getRepoNames(owner, octokit);
    } else {
      names = repos;
    }
  
    for (let repo of names) {
      let rpArtifacts = await repoArtifacts.getArtifacts(currentPeriodDays, repo, owner, octokit);
      artifacts.push(...rpArtifacts);
    }

    return artifacts;
  } catch(error) {
    throw error;
  }
}

export const orgRepos = {
  getArtifactsForRepos: getArtifactsForRepos
}
