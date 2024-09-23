import { repoArtifacts } from '../src/repo-artifacts.js';
import Moctokit from './support/moctokit.js';

describe("Repo Artifacts", function() {
  let octokit;
  let owner = 'orgA';
  let repo = 'repoA';
  let date = new Date(2024, 8, 15);
  // Reminder: JavaScript's Date object uses 0-indexed months, so 8 is September
  let baseTime = new Date(date.setUTCHours(17, 0, 0, 0));

  let mockData = [
    {
      id: 1935330537,
      name: 'artifact',
      size_in_bytes: 930725,
      expired: false,
      expires_at: new Date(baseTime.getTime() + (24 * 60 * 60 * 1000 * 5)).toISOString()
      // expires 5 days from now, including today
    },
    {
      id: 1935330527,
      name: 'artifact',
      size_in_bytes: 970351,
      expired: false,
      expires_at: new Date(baseTime.getTime() + (3 * 60 * 60 * 1000)).toISOString()
      // expires 3 hours from now (expires today)
    },
    {
      id: 1935330523,
      name: 'artifact',
      size_in_bytes: 921372,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (12 * 60 * 60 * 1000)).toISOString()
      // expired 12 hours ago (expired today)
    },
    {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970209,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 1)).toISOString()
      // expired yesterday
    },
    {
      id: 1723785662,
      name: "artifact",
      size_in_bytes: 476841352,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 6)).toISOString()
      // created 7 days ago, including today
    },
    {
      id: 1653352710,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 7)).toISOString()
      // expired 8 days ago, including today
    },
    {
      id: 1653352608,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 8)).toISOString()
      // expired 9 days ago, including today
    },
    {
      id: 1653351235,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 14)).toISOString()
      // expired 15 days ago, including today
    },
    {
      id: 1653351234,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 15)).toISOString()
      // expired 16 days ago, including today
    },
    {
      id: 1653253124,
      name: "artifact",
      size_in_bytes: 9551553,
      expired: true,
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 30)).toISOString()
      // expired 31 days ago, including today
    },
  ];

  beforeEach(() => {
    octokit = new Moctokit(mockData);

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(baseTime));
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('gets artifacts for the past day', async function () {
    let startDate = new Date(date);
    startDate = startDate.setUTCHours(0, 0, 0, 0);

    let artifacts = await repoArtifacts.getArtifacts(1, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(3);
    for (let i = 0; i < artifacts.length; i++) {
      expect(new Date(artifacts[i].expires_at) >= startDate).toBeTrue();
    }
  });

  it('gets artifacts for the past 7 days', async function () {
    let startDate = new Date(date);
    startDate.setUTCDate(date.getUTCDate() - 6)
    startDate = startDate.setUTCHours(0, 0, 0, 0);

    let artifacts = await repoArtifacts.getArtifacts(7, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(5);
    for (let i = 0; i < artifacts.length; i++) {
      expect(new Date(artifacts[i].expires_at) >= startDate).toBeTrue();
    }
  });

  it('gets artifacts for the past 15 days', async function () {
    let startDate = new Date(date);
    startDate.setUTCDate(date.getUTCDate() - 14)
    startDate = startDate.setUTCHours(0, 0, 0, 0);

    let artifacts = await repoArtifacts.getArtifacts(15, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(8);
    for (let i = 0; i < artifacts.length; i++) {
      expect(new Date(artifacts[i].expires_at) >= startDate).toBeTrue();
    }
  });

  it('handles errors', async function() {
    let caughtError;
    let octokitTestError = new Moctokit([], true);

    try {
      await repoArtifacts.getArtifacts(15, repo, owner, octokitTestError);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toEqual(new Error('fetch error'));
  });
});
