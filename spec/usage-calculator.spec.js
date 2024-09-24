import { usageCalculator } from '../src/usage-calculator.js';

describe("Usage Calculator", function() {
  let currentPeriodDays = 7;

  let baseTime = new Date(2024, 8, 15);
  // Reminder: JavaScript's Date object uses 0-indexed months, so 8 is September

  let endDate = new Date(baseTime);
  endDate = endDate.setUTCHours(23, 59, 59, 999);

  let startDate = new Date(baseTime);
  startDate.setUTCDate(baseTime.getUTCDate() - (currentPeriodDays - 1));
  startDate = startDate.setUTCHours(0, 0, 0, 0);

  it('calculates usage when the artifact is billed for the whole period', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: false,
      created_at: "2024-09-04T22:50:50Z",
      expires_at: "2024-12-02T22:49:21Z"
      // created before the start date
      // expires after the end date
      // usage between the start and end date
      // usage for 7 days
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(6791470);
    expect(usage.total_usage).toEqual(87318900);
  });

  it('calculates usage when the artifact is billed from the start date to the expiration date', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: true,
      created_at: "2024-09-04T22:50:50Z",
      expires_at: "2024-09-14T22:49:21Z"
      // created before the start date
      // expires before the end date
      // usage between the start date and expiration date
      // usage for 6 days
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(5821260);
    expect(usage.total_usage).toEqual(10672310);
  });

  it('calculates usage when the artifact is billed from the created date to the end date', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: false,
      created_at: "2024-09-10T22:50:50Z",
      expires_at: "2024-09-17T22:49:21Z"
      // created after the start date
      // expires after the end date
      // usage between the created date and end date
      // usage for 6 days
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(5821260);
    expect(usage.total_usage).toEqual(7761680);
  });

  it('calculates usage when the artifact is billed from the created date to the expiration date', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: true,
      created_at: "2024-09-10T22:50:50Z",
      expires_at: "2024-09-14T22:49:21Z"
      // created after the start date
      // expires before the end date
      // usage between the created date and expiration date
      // billed for 5 days
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(4851050);
    expect(usage.total_usage).toEqual(4851050);
  });

  it('calculates usage when the artifact is created the same day as the end date', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: false,
      created_at: "2024-09-15T15:50:50Z",
      expires_at: "2024-10-15T15:49:21Z"
      // created the same day as the end date
      // expires after the end date
      // usage for 1 day
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(970210);
    expect(usage.total_usage).toEqual(30076510);
  });

  it('calculates usage when the artifact is created the same day as the start date', function() {
    let artifact = {
      id: 1935320941,
      name: 'artifact',
      size_in_bytes: 970210,
      expired: true,
      created_at: "2024-09-01T22:50:50Z",
      expires_at: "2024-09-09T22:49:21Z"
      // created before the start date
      // expires the same day as the start date
      // usage for 1 day
    };

    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);
    expect(usage.current_period_usage).toEqual(970210);
    expect(usage.total_usage).toEqual(8731890);
  });
});
