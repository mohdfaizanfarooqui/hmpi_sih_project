// WHO/EPA Permissible limits (mg/L)
const LIMITS = {
  lead: 0.01,
  mercury: 0.006,
  cadmium: 0.003,
  arsenic: 0.01,
  chromium: 0.05,
  copper: 2.0,
  zinc: 3.0,
  nickel: 0.07
};

// Weights for HPI calculation
const WEIGHTS = {
  lead: 5,
  mercury: 5,
  cadmium: 5,
  arsenic: 5,
  chromium: 4,
  copper: 3,
  zinc: 2,
  nickel: 4
};

function calculateHPI(metals) {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [metal, concentration] of Object.entries(metals)) {
    if (LIMITS[metal] && WEIGHTS[metal]) {
      const qi = (concentration / LIMITS[metal]) * 100;
      weightedSum += WEIGHTS[metal] * qi;
      totalWeight += WEIGHTS[metal];
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function calculateHEI(metals) {
  let sum = 0;

  for (const [metal, concentration] of Object.entries(metals)) {
    if (LIMITS[metal]) {
      sum += concentration / LIMITS[metal];
    }
  }

  return sum;
}

function calculateCd(metals) {
  let sum = 0;
  let count = 0;

  for (const [metal, concentration] of Object.entries(metals)) {
    if (LIMITS[metal]) {
      sum += concentration / LIMITS[metal];
      count++;
    }
  }

  return count > 0 ? sum : 0;
}

function getHealthRisk(hpi, hei, cd) {
  if (hpi > 100 || hei > 40 || cd > 20) {
    return 'Critical';
  } else if (hpi > 45 || hei > 20 || cd > 10) {
    return 'High';
  } else if (hpi > 30 || hei > 10 || cd > 5) {
    return 'Moderate';
  } else if (hpi > 15 || hei > 5 || cd > 2) {
    return 'Low';
  }
  return 'Minimal';
}

function calculateIndices(metals) {
  const hpi = calculateHPI(metals);
  const hei = calculateHEI(metals);
  const cd = calculateCd(metals);
  const healthRisk = getHealthRisk(hpi, hei, cd);

  return {
    hpi: parseFloat(hpi.toFixed(2)),
    hei: parseFloat(hei.toFixed(2)),
    cd: parseFloat(cd.toFixed(2)),
    healthRisk
  };
}

module.exports = { calculateIndices, LIMITS, WEIGHTS };
