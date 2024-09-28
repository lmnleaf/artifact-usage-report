import { orgRepos } from '../src/org-repos.js';
import { repoNames } from '../src/repo-names.js';
import { repoArtifacts } from '../src/repo-artifacts.js';
import Moctokit from './support/moctokit.js';

describe("Org Repos", function() {
  let octokit;
  let getRepoNamesOriginal;
  let getRepoArtifactsOriginal;
  let owner = 'org';
  let repos = ['repoA', 'repoB'];
  let currentPeriodDays = 30;
  let repoNamesData = ['repoA', 'repoB', 'repoC'];
  let artifactData = [
    {
      id: 1935330537,
      name: 'artifact',
      size_in_bytes: 930725,
      expired: false,
      created_at: '2024-08-05T22:51:24Z',
      expires_at: '2024-08-20T22:51:24Z'
    },
    {
      id: 1723785662,
      name: "artifact",
      size_in_bytes: 476841352,
      expired: true,
      created_at: '2024-08-01T22:51:24Z',
      expires_at: '2024-08-15T22:51:24Z'
    }
  ]
 
  beforeEach(() => {
    octokit = new Moctokit();

    getRepoNamesOriginal = repoNames.getRepoNames;
    repoNames.getRepoNames = jasmine.createSpy('getRepoNames').and.returnValue(Promise.resolve(repoNamesData));

    getRepoArtifactsOriginal = repoArtifacts.getArtifacts;
    repoArtifacts.getArtifacts = jasmine.createSpy('getPRs').and.returnValue(Promise.resolve(artifactData));
  });
 
  afterEach(() => {
    // reset to original module function, so doesn't affect other tests
    repoNames.getRepoNames = getRepoNamesOriginal;
    repoArtifacts.getArtifacts = getRepoArtifactsOriginal;
  });

  it('gets artifacts for a list of repos', async function() {
    let artifacts = await orgRepos.getArtifactsForRepos(currentPeriodDays, repos, owner, octokit);

    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(currentPeriodDays, 'repoA', owner, octokit);
    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(currentPeriodDays, 'repoB', owner, octokit);
    expect(repoNames.getRepoNames).not.toHaveBeenCalled();
    expect(artifacts.length).toEqual(4);
  });

  it('gets artifacts for all repos in an org', async function() {
    let artifacts = await orgRepos.getArtifactsForRepos(currentPeriodDays, ['all'], owner, octokit);

    expect(repoNames.getRepoNames).toHaveBeenCalledWith(owner, octokit);
    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(currentPeriodDays, 'repoA', owner, octokit);
    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(currentPeriodDays, 'repoB', owner, octokit);
    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(currentPeriodDays, 'repoC', owner, octokit);
    expect(artifacts.length).toEqual(6);
  });

  it('handles errors', async function() {
    repoArtifacts.getArtifacts = jasmine.createSpy('getArtifacts').and.returnValue(Promise.reject(new Error('fetch error')));
    let caughtError;
    let octokitTestError = new Moctokit([], true);
 
    try {
      await orgRepos.getArtifactsForRepos(owner, octokitTestError);
    } catch (error) {
      caughtError = error;
    }
  });
});
