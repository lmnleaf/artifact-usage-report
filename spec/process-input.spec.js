import { processInput } from '../src/process-input.js';

describe("Process Input", function() {
  let days = 7;
  let repos = 'repoA,repoB';
  let context = { repo: { owner: 'org', repo: 'cool-repo' } };

  it('processes input when days and repos are provided', function() {
    const input = processInput(days, repos, context);
    expect(input.currentPeriodDays).toEqual(7);
    expect(input.repos).toEqual(['repoA', 'repoB']);
    expect(input.owner).toEqual('org');
  });

  it('processes input when no days are provided (defaults to 30 days)', function() {
    const input = processInput(null, repos, context);
    expect(input.currentPeriodDays).toEqual(30);
  });

  it('processes input when no repos are provided (defaults to repo in context)', function() {
    const input = processInput(days, null, context);
    expect(input.owner).toEqual('org');
    expect(input.repos).toEqual(['cool-repo']);
  });

  it('processes input when no days and no repos are provied', function() {
    const input = processInput(null, null, context);
    expect(input.currentPeriodDays).toEqual(30);
    expect(input.repos).toEqual(['cool-repo']);
  });

  it('errors when days is set to fewer than 1', function() {
    let caughtError;
    let expectedError = new Error('current_period_days must be greater than 0 and less than or equal to 400.');

    try {
      processInput(0);
    } catch (error) {
      caughtError = expectedError;
    }
  });

  it('errors when current_period_days is set to greater than 400', function() {
    let caughtError;
    let expectedError = new Error('current_period_days must be greater than 0 and less than or equal to 400.');

    try {
      processInput(500);
    } catch (error) {
      caughtError = expectedError;
    }
  });
});
