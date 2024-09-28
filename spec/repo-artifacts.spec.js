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
      created_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 5)).toISOString(),
      // created 5 days ago
      expires_at: new Date(baseTime.getTime() + (24 * 60 * 60 * 1000 * 5)).toISOString()
      // expires 5 days from now, including today
    },
    {
      id: 1935330527,
      name: 'artifact',
      size_in_bytes: 970351,
      expired: false,
      created_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 3)).toISOString(),
      // created 3 days ago
      expires_at: new Date(baseTime.getTime() + (3 * 60 * 60 * 1000)).toISOString()
      // expires 3 hours from now (expires today)
    },
    {
      id: 1935330523,
      name: 'artifact',
      size_in_bytes: 921372,
      expired: true,
      created_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 4)).toISOString(),
      // created 4 days ago
      expires_at: new Date(baseTime.getTime() - (12 * 60 * 60 * 1000)).toISOString()
      // expired 12 hours ago (expired today)
    },
    {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970209,
      expired: true,
      created_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 6)).toISOString(),
      // created 6 days ago
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 1)).toISOString()
      // expired yesterday
    },
    {
      id: 1723785662,
      name: "artifact",
      size_in_bytes: 476841352,
      expired: true,
      created_at: '2024-08-01T22:51:24Z',
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 6)).toISOString()
      // expires 7 days ago, including today
    },
    {
      id: 1653352710,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: '2024-07-01T22:51:24Z',
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 7)).toISOString()
      // expired 8 days ago, including today
    },
    {
      id: 1653352608,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: '2024-07-01T22:51:24Z',
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 8)).toISOString()
      // expired 9 days ago, including today
    },
    {
      id: 1653351235,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: '2024-07-01T22:51:24Z',
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 14)).toISOString()
      // expired 15 days ago, including today
    },
    {
      id: 1653351234,
      name: "artifact",
      size_in_bytes: 934441,
      expired: true,
      created_at: '2024-07-01T22:51:24Z',
      expires_at: new Date(baseTime.getTime() - (24 * 60 * 60 * 1000 * 15)).toISOString()
      // expired 16 days ago, including today
    },
    {
      id: 1653253124,
      name: "artifact",
      size_in_bytes: 9551553,
      expired: true,
      created_at: '2024-07-01T22:51:24Z',
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

  it('sets current period and total usage on the artifacts', async function () {
    // let startDate = new Date(date);
    // startDate.setUTCDate(date.getUTCDate() - 6)
    // startDate = startDate.setUTCHours(0, 0, 0, 0);

    let artifacts = await repoArtifacts.getArtifacts(2, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(4);
    expect(artifacts[0].current_period_usage_in_bytes).toBe(1861450);
    expect(artifacts[0].total_usage_in_bytes).toBe(10237975);
    expect(artifacts[0].repo).toBe('repoA');
    expect(artifacts[1].current_period_usage_in_bytes).toBe(1940702);
    expect(artifacts[1].total_usage_in_bytes).toBe(4851755);
    expect(artifacts[1].repo).toBe('repoA');
    expect(artifacts[2].current_period_usage_in_bytes).toBe(1842744);
    expect(artifacts[2].total_usage_in_bytes).toBe(4606860);
    expect(artifacts[2].repo).toBe('repoA');
    expect(artifacts[3].current_period_usage_in_bytes).toBe(970209);
    expect(artifacts[3].total_usage_in_bytes).toBe(5821254);
    expect(artifacts[3].repo).toBe('repoA');
  });

  it('sets current period start and end dates on the artifacts', async function () {
    let startDate = new Date(date);
    startDate.setUTCDate(date.getUTCDate() - 1)
    startDate = startDate.setUTCHours(0, 0, 0, 0);

    let endDate = new Date(date);
    endDate = endDate.setUTCHours(23, 59, 59, 999);

    let artifacts = await repoArtifacts.getArtifacts(2, repo, owner, octokit);

    expect(octokit.paginate).toHaveBeenCalled();
    expect(artifacts.length).toBe(4);
    expect(artifacts[0].current_period_starts_at).toBe(new Date(startDate).toISOString());
    expect(artifacts[0].current_period_ends_at).toBe(new Date(endDate).toISOString());
    expect(artifacts[3].current_period_starts_at).toBe(new Date(startDate).toISOString());
    expect(artifacts[3].current_period_ends_at).toBe(new Date(endDate).toISOString());
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

  it('handles not found errors', async function() {
    let caughtError;
    let octokitTestError = new Moctokit([], true, 'Not Found');

    try {
      await repoArtifacts.getArtifacts(15, repo, owner, octokitTestError);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toEqual(new Error('Repository not found: repoA'));
  });
});
