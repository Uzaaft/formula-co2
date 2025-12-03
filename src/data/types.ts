export interface Race {
  id: string;
  name: string;
  country: string;
  city: string;
  circuit: string;
  lat: number;
  lng: number;
  date: string;
}

export interface RaceEmissions {
  raceId: string;
  logistics: number; // tCO2e - freight, equipment transport
  teamTravel: number; // tCO2e - team personnel flights
  carEmissions: number; // tCO2e - race weekend fuel burn
  eventOperations: number; // tCO2e - venue energy, hospitality
  broadcast: number; // tCO2e - TV production
}

export interface SeasonTotals {
  year: number;
  totalEmissions: number; // tCO2e
  logistics: number;
  teamTravel: number;
  carEmissions: number;
  eventOperations: number;
  broadcast: number;
  factoriesAndFacilities: number;
}

export interface TravelRoute {
  from: Race;
  to: Race;
  distance: number; // km
  emissions: number; // tCO2e
}
