export type UnitCategory = "Standard" | "Local";

export interface UnitDefinition {
  name: string;
  sqFtValue: number;
  category: UnitCategory;
  description?: string;
}

export interface DistrictOverride {
  units: Record<string, number>; // Maps unit name to sqFtValue for this specific district
}

export interface StateData {
  name: string;
  units: Record<string, number>; // Maps local unit name to sqFtValue
  districts?: Record<string, DistrictOverride>;
}

// Base standard units available everywhere
export const STANDARD_UNITS: Record<string, number> = {
  "Square Feet (sq ft)": 1,
  "Square Meter (sq m)": 10.7639,
  "Square Yard (Gaj)": 9,
  "Acre": 43560,
  "Hectare": 107639.1,
  "Are": 1076.39,
  "Square Inch": 0.00694444
};

// State-specific local units and district overrides
export const STATE_LAND_DATA: Record<string, StateData> = {
  "Assam": {
    name: "Assam",
    units: {
      "Bigha": 14400,
      "Kattha": 2880,
      "Lecha": 144
    }
  },
  "Bihar": {
    name: "Bihar",
    units: {
      "Bigha": 27220,
      "Kattha": 1361,
      "Dhur": 68.05,
      "Dhurki": 3.4025
    },
    districts: {
      "Patna": {
        units: { "Bigha": 27220, "Kattha": 1361 } // Just an example, often varies locally
      }
    }
  },
  "Gujarat": {
    name: "Gujarat",
    units: {
      "Bigha": 17424,
      "Vigha": 17424,
      "Guntha": 1089,
      "Biswa": 871.2
    }
  },
  "Haryana": {
    name: "Haryana",
    units: {
      "Bigha": 27225,
      "Kanal": 5445,
      "Marla": 272.25,
      "Biswa": 1361.25,
      "Sarsahi (Square Karam)": 30.25
    }
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    units: {
      "Bigha": 8712,
      "Kanal": 5445,
      "Marla": 272.25,
      "Biswa": 435.6
    }
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    units: {
      "Bigha": 12000, // MP bigha can range from 8000 to 12000
      "Kattha": 600
    }
  },
  "Maharashtra": {
    name: "Maharashtra",
    units: {
      "Guntha (Gunta)": 1089,
      "Bigha": 27225
    }
  },
  "Punjab": {
    name: "Punjab",
    units: {
      "Bigha": 9070,
      "Kanal": 5445,
      "Marla": 272.25,
      "Biswa": 453.5
    }
  },
  "Rajasthan": {
    name: "Rajasthan",
    units: {
      "Bigha (Pucca)": 27225,
      "Bigha (Kachha)": 17424,
      "Biswa (Pucca)": 1361.25,
      "Biswa (Kachha)": 871.2
    }
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    units: {
      "Ground": 2400,
      "Cent": 435.6,
      "Ankanam": 72,
      "Guntha": 1089
    }
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    units: {
      "Bigha": 27000,
      "Biswa": 1350,
      "Biswansi": 67.5,
      "Kachha Bigha": 8712
    },
    districts: {
      "East UP (General)": { units: { "Bigha": 20000 } },
      "West UP (General)": { units: { "Bigha": 27225 } }
    }
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    units: {
      "Bigha": 6804,
      "Nali": 2160,
      "Mutthi": 135
    }
  },
  "West Bengal": {
    name: "West Bengal",
    units: {
      "Bigha": 14400,
      "Kattha": 720,
      "Chatak": 45
    }
  },
  "Jharkhand": {
    name: "Jharkhand",
    units: {
      "Bigha": 27220,
      "Kattha": 1361,
      "Dhur": 68.05
    }
  },
  "Karnataka": {
    name: "Karnataka",
    units: {
      "Guntha (Gunta)": 1089,
      "Cent": 435.6,
      "Ankanam": 72
    }
  },
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    units: {
      "Guntha (Gunta)": 1089,
      "Ankanam": 72,
      "Cent": 435.6
    }
  },
  "Kerala": {
    name: "Kerala",
    units: {
      "Cent": 435.6
    }
  }
};

export function getUnitsForLocation(stateName: string, districtName?: string): Record<string, number> {
  const units = { ...STANDARD_UNITS };
  
  if (stateName && STATE_LAND_DATA[stateName]) {
    const stateData = STATE_LAND_DATA[stateName];
    // Add state defaults
    Object.entries(stateData.units).forEach(([unitName, sqFtValue]) => {
      units[unitName] = sqFtValue;
    });
    
    // Add district overrides
    if (districtName && stateData.districts && stateData.districts[districtName]) {
      const districtOverrides = stateData.districts[districtName].units;
      Object.entries(districtOverrides).forEach(([unitName, sqFtValue]) => {
        units[unitName] = sqFtValue;
      });
    }
  }
  
  return units;
}
