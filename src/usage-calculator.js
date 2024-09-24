function calculate(artifact, startDate, endDate, totalDays) {
  let totalBillableDays = totalDays;
  let createdDate = new Date(artifact.created_at);
  let expiredDate = new Date(artifact.expires_at);

  if (createdDate > startDate) {
    if (String(artifact.expired).toLowerCase() === 'true') {
      createdDate = createdDate.setUTCHours(0, 0, 0, 0);
      expiredDate = expiredDate.setUTCHours(23, 59, 59, 999);
      totalBillableDays = Math.ceil((expiredDate - createdDate) / (24 * 60 * 60 * 1000));
    } else {
      totalBillableDays = Math.ceil((endDate - createdDate) / (24 * 60 * 60 * 1000));
    }
  } else {
    if (String(artifact.expired).toLowerCase() === 'true') {
      totalBillableDays = Math.ceil((expiredDate - startDate) / (24 * 60 * 60 * 1000));
    }
  }

  return artifact.size_in_bytes * totalBillableDays;
}

export const usageCalculator = {
  calculate: calculate
}
