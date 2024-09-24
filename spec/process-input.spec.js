import { processInput } from '../src/process-input.js';

describe("Process Input", function() {
  let currentPeriodDays = 30;

  it('processes input when days are provided', async function() {
    const currentPeriodDays = processInput(7);
    expect(currentPeriodDays).toEqual(7);
  });

  it('processes input when no days are provided (defaults to current 30 days)', async function() {
    const currentPeriodDays = processInput(null);
    expect(currentPeriodDays).toEqual(30);
  });

  it('errors when days is set to greater than 400 (defaults to 30 days)', async function() {
    let caughtError;
    let expectedError = new Error('total_days must be greater than 0 and less than or equal to 365.');

    try {
      processInput(500);
    } catch (error) {
      caughtError = expectedError;
    }
  });

  it('errors when days is set to fewer than 1 (defaults to 30 days)', async function() {
    let caughtError;
    let expectedError = new Error('total_days must be greater than 0 and less than or equal to 365.');

    try {
      processInput(0);
    } catch (error) {
      caughtError = expectedError;
    }
  });
});
