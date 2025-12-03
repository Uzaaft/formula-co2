import type { RaceEmissions, SeasonTotals } from "./types";

// Based on F1's 2024 sustainability report:
// - Total 2024 footprint: 168,720 tCO2e
// - Logistics: ~45% of total (~75,924 tCO2e)
// - Team/Personnel Travel: ~23% (~38,806 tCO2e)
// - Factories & Facilities: ~20% (~33,744 tCO2e) - not per-race
// - Event Operations: ~8% (~13,498 tCO2e)
// - Broadcast: ~3% (~5,062 tCO2e)
// - Cars on track: <1% (~1,687 tCO2e)

// Per-race estimates (24 races in 2024)
// Flyaway races have ~2-3x higher logistics emissions than European races

const EUROPEAN_LOGISTICS = 2200; // tCO2e per race
const FLYAWAY_LOGISTICS = 4500; // tCO2e per race
const LONG_HAUL_LOGISTICS = 5500; // tCO2e (Australia, Americas, Asia)

const EUROPEAN_TRAVEL = 800; // tCO2e per race
const FLYAWAY_TRAVEL = 2200; // tCO2e per race
const LONG_HAUL_TRAVEL = 2800; // tCO2e (furthest destinations)

const EVENT_OPS_BASE = 520; // tCO2e per race
const BROADCAST_BASE = 210; // tCO2e per race
const CAR_EMISSIONS = 70; // tCO2e per race (all cars, all sessions)

type Region = "europe" | "middle-east" | "asia" | "americas" | "oceania";

const raceRegions: Record<string, Region> = {
  bahrain: "middle-east",
  "saudi-arabia": "middle-east",
  australia: "oceania",
  japan: "asia",
  china: "asia",
  miami: "americas",
  imola: "europe",
  monaco: "europe",
  canada: "americas",
  spain: "europe",
  austria: "europe",
  uk: "europe",
  hungary: "europe",
  belgium: "europe",
  netherlands: "europe",
  monza: "europe",
  azerbaijan: "middle-east",
  singapore: "asia",
  austin: "americas",
  mexico: "americas",
  brazil: "americas",
  "las-vegas": "americas",
  qatar: "middle-east",
  "abu-dhabi": "middle-east",
};

function getLogistics(region: Region): number {
  switch (region) {
    case "europe":
      return EUROPEAN_LOGISTICS;
    case "middle-east":
      return FLYAWAY_LOGISTICS;
    case "asia":
      return LONG_HAUL_LOGISTICS;
    case "americas":
      return LONG_HAUL_LOGISTICS;
    case "oceania":
      return LONG_HAUL_LOGISTICS * 1.2; // Australia is furthest
  }
}

function getTravel(region: Region): number {
  switch (region) {
    case "europe":
      return EUROPEAN_TRAVEL;
    case "middle-east":
      return FLYAWAY_TRAVEL;
    case "asia":
      return LONG_HAUL_TRAVEL;
    case "americas":
      return LONG_HAUL_TRAVEL;
    case "oceania":
      return LONG_HAUL_TRAVEL * 1.3;
  }
}

export const raceEmissions2024: RaceEmissions[] = Object.entries(
  raceRegions
).map(([raceId, region]) => ({
  raceId,
  logistics: getLogistics(region),
  teamTravel: getTravel(region),
  carEmissions: CAR_EMISSIONS,
  eventOperations: EVENT_OPS_BASE,
  broadcast: BROADCAST_BASE,
}));

export const seasonTotals2024: SeasonTotals = {
  year: 2024,
  totalEmissions: 168720,
  logistics: raceEmissions2024.reduce((sum, r) => sum + r.logistics, 0),
  teamTravel: raceEmissions2024.reduce((sum, r) => sum + r.teamTravel, 0),
  carEmissions: raceEmissions2024.reduce((sum, r) => sum + r.carEmissions, 0),
  eventOperations: raceEmissions2024.reduce(
    (sum, r) => sum + r.eventOperations,
    0
  ),
  broadcast: raceEmissions2024.reduce((sum, r) => sum + r.broadcast, 0),
  factoriesAndFacilities: 33744,
};

// Historical comparison (from F1 reports)
export const historicalTotals: SeasonTotals[] = [
  {
    year: 2018,
    totalEmissions: 228793,
    logistics: 71410,
    teamTravel: 79400,
    carEmissions: 1900,
    eventOperations: 15200,
    broadcast: 6800,
    factoriesAndFacilities: 54083,
  },
  {
    year: 2022,
    totalEmissions: 223031,
    logistics: 69500,
    teamTravel: 72000,
    carEmissions: 1800,
    eventOperations: 14500,
    broadcast: 6200,
    factoriesAndFacilities: 59031,
  },
  seasonTotals2024,
];

export function getEmissionsForRace(raceId: string): RaceEmissions | undefined {
  return raceEmissions2024.find((e) => e.raceId === raceId);
}

export function getTotalForRace(raceId: string): number {
  const e = getEmissionsForRace(raceId);
  if (!e) return 0;
  return (
    e.logistics + e.teamTravel + e.carEmissions + e.eventOperations + e.broadcast
  );
}
