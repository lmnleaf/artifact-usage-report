import { repoNames } from '../src/repo-names.js';
import Moctokit from './support/moctokit.js';

describe("Repo Names", function() {
  let octokit;
  let owner = 'org';
  let mockData = [
    {
      name: 'repoA',
      archived: false
    },
    {
      name: 'repoB',
      archived: 'false'
    },
    {
      name: 'repoC',
      archived: true
    }
  ];

  beforeEach(function() {
    octokit = new Moctokit(mockData);
  });

  it ('gets repo names for an org, including only names for repos that are NOT archived', async function() {
    let repos = await repoNames.getRepoNames(owner, octokit);

    expect(repos).toEqual(['repoA', 'repoB']);
  });

  it('handles errors', async function() {
    let caughtError;
    let octokitTestError = new Moctokit([], true);

    try {
      await repoNames.getRepoNames(owner, octokitTestError);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toEqual(new Error('fetch error'));
  });
});
