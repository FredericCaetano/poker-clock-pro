/**
 * payouts.js — calcul du prizepool et répartition des gains.
 */

export function calculatePrizepool({ buyIn, rebuyAmount, addonAmount, registrations, rakePercent = 0 }) {
  const buyIns = registrations.length * buyIn;
  const rebuys = registrations.reduce((sum, r) => sum + (r.rebuys || 0), 0) * rebuyAmount;
  const addons = registrations.reduce((sum, r) => sum + (r.addons || 0), 0) * addonAmount;
  const gross = buyIns + rebuys + addons;
  const rake = gross * (rakePercent / 100);
  return { gross, rake, net: gross - rake };
}

// Structure de payout classique en % par nombre de joueurs payés.
// À affiner / rendre configurable par tournoi.
export function defaultPayoutStructure(paidPlaces) {
  const structures = {
    1: [100],
    2: [65, 35],
    3: [50, 30, 20],
    4: [42, 28, 18, 12],
    5: [36, 26, 18, 12, 8],
    6: [32, 24, 17, 13, 9, 5],
  };
  return structures[paidPlaces] || structures[6];
}

export function computePayouts(prizepoolNet, paidPlaces) {
  const structure = defaultPayoutStructure(paidPlaces);
  return structure.map((pct, i) => ({
    position: i + 1,
    percentage: pct,
    amount: Math.round((prizepoolNet * pct) / 100),
  }));
}
