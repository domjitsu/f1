export interface Race {
  round: string;
  raceName: string;
}

export interface RaceData {
  MRData: {
    RaceTable: {
      Races: Race[];
    };
  };
}

export interface Driver {
  laps: string;
  Driver: {
    code: string;
    driverId: string;
    familyName: string;
    givenName: string;
  };
  FastestLap?: {
    Time?: {
      time: string;
    };
  };
}

interface Lap {
  Timings: Timings[];
}

interface Timings {
  driverId: string;
  position: string;
  time: string;
}

export interface RaceResult {
  MRData: {
    RaceTable: {
      Races: {
        Results: Driver[];
        Laps: Lap[];
      }[];
    };
  };
}
