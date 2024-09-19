import { repoArtifacts } from '../src/repo-artifacts.js';
import Moctokit from './support/moctokit.js';

describe("Repo Artifacts", function() {
  let octokit;
  let baseTime = new Date(2024, 8, 15);
  // Reminder: JavaScript's Date object uses 0-indexed months, so 8 is September
  let owner = 'orgA';
  let repo = 'repoA';

  let mockData = [
    {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970209,
      expired: false,
      created_at: new Date(baseTime - (24 * 60 * 60 * 1000 * 10)).toISOString()
    },
    {
      id: 1774246572,
      name: "artifact",
      size_in_bytes: 9551553,
      expired: false,
      created_at: new Date(baseTime - (24 * 60 * 60 * 1000 * 15)).toISOString()
    },
    {
      id: 1723785662,
      name: "artifact",
      size_in_bytes: 476841352,
      expired: false,
      created_at: new Date(baseTime - (24 * 60 * 60 * 1000 * 30)).toISOString()
    },
    {
      id: 1653352608,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: new Date(baseTime - (24 * 60 * 60 * 1000 * 90)).toISOString()
      // artifact created 90 days ago
      // updated_at: "2024-05-30T22:51:23Z",
      // expires_at: "2024-08-28T22:49:51Z",
    },
    {
      id: 1653351234,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: new Date(baseTime - (24 * 60 * 60 * 1000 * 95)).toISOString()
    }
  ];

  beforeEach(() => {
    octokit = new Moctokit(mockData);

    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);
  })

  afterEach(function () {
    jasmine.clock().uninstall();
  })

  it('gets artifacts for the past 90 days', async function () {
    const artifacts = await repoArtifacts.getArtifacts(90, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(4);
    for (let i = 0; i < artifacts.length; i++) {
      expect(new Date(artifacts[i].created_at) <= new Date()).toBeTrue();
    }
  })

  it('gets artifacts for the past 15 days', async function () {
    const artifacts = await repoArtifacts.getArtifacts(15, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(2);
    for (let i = 0; i < artifacts.length; i++) {
      expect(new Date(artifacts[i].created_at) <= new Date()).toBeTrue();
    }
  })

  it('handles errors', async function() {
    let caughtError;
    let octokitTestError = new Moctokit([], true);

    try {
      await repoArtifacts.getArtifacts(15, repo, owner, octokitTestError);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toEqual(new Error('fetch error'));
  })
});
