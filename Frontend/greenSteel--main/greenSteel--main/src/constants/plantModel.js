// =====================================================================
// GreenSteel plant model — integrated steel plant (BF–BOF route)
// ---------------------------------------------------------------------
// 1. POLLUTANTS: what we track, display units and DEFAULT reference limits.
//    Defaults are typical stack-emission reference values for an integrated
//    steel plant. If an Emission Type in the database carries `limitValue`,
//    that value wins — so each plant can set limits from its own consent
//    conditions without touching code.
// 2. PLANT_NODES / GAS_FLOWS: how departments are physically connected.
//    By-product gases and materials move between departments, so a problem
//    in one department changes emissions in the departments it feeds.
// =====================================================================

export const POLLUTANTS = [
    { key: 'cox', label: 'COx', name: 'Carbon oxides', unit: 'ppm', limit: 500, color: '#334155', aliases: ['cox', 'co', 'co2', 'carbon', 'carbonoxides', 'carbonmonoxide', 'carbondioxide'] },
    { key: 'nox', label: 'NOx', name: 'Nitrogen oxides', unit: 'ppm', limit: 300, color: '#047857', aliases: ['nox', 'no', 'no2', 'nitrogen', 'nitrogenoxides'] },
    { key: 'sox', label: 'SOx', name: 'Sulphur oxides', unit: 'ppm', limit: 300, color: '#D97706', aliases: ['sox', 'so2', 'sulphur', 'sulfur', 'sulphuroxides', 'sulfuroxides', 'sulphurdioxide', 'sulfurdioxide'] },
    { key: 'pm', label: 'PM', name: 'Particulate matter', unit: 'mg/Nm³', limit: 50, color: '#DC2626', aliases: ['pm', 'pm10', 'pm25', 'particulate', 'particulatematter', 'dust'] },
];

// A reading at or above this share of its limit is "approaching limit"
export const WARNING_RATIO = 0.8;

// Process departments drawn on the plant map. `aliases` match department
// names coming from the database (case/spacing-insensitive).
export const PLANT_NODES = [
    { id: 'coke', label: 'Coke Oven', short: 'CO', x: 12, y: 22, aliases: ['coke oven', 'coke ovens', 'coke plant'], role: 'Converts coal to coke; releases coke-oven gas (COG).' },
    { id: 'sinter', label: 'Sinter Plant', short: 'SP', x: 12, y: 74, aliases: ['sinter plant', 'sinter', 'sintering'], role: 'Agglomerates iron-ore fines into sinter for the furnace.' },
    { id: 'bf', label: 'Blast Furnace', short: 'BF', x: 42, y: 48, aliases: ['blast furnace', 'blast furnaces', 'bf'], role: 'Smelts sinter + coke into hot metal; releases BF gas.' },
    { id: 'sms', label: 'Steel Melting Shop', short: 'SMS', x: 72, y: 22, aliases: ['steel melting shop', 'steel melt shop', 'sms', 'bof', 'ld converter'], role: 'Converts hot metal to steel; releases converter (LD) gas.' },
    { id: 'power', label: 'Power Plant', short: 'PP', x: 72, y: 74, aliases: ['power plant', 'captive power plant', 'cpp'], role: 'Burns COG, BF and LD gas to make power and steam.' },
    { id: 'utilities', label: 'Utilities', short: 'UT', x: 92, y: 48, aliases: ['utilities', 'utility'], role: 'Oxygen, compressed air, water and steam for the plant.' },
];

// Directed flows: from → to. `kind` sets the line style.
export const GAS_FLOWS = [
    { from: 'coke', to: 'bf', label: 'Coke + COG', kind: 'gas' },
    { from: 'coke', to: 'sinter', label: 'Coke breeze', kind: 'material' },
    { from: 'coke', to: 'power', label: 'COG', kind: 'gas' },
    { from: 'sinter', to: 'bf', label: 'Sinter', kind: 'material' },
    { from: 'bf', to: 'sms', label: 'Hot metal', kind: 'material' },
    { from: 'bf', to: 'power', label: 'BF gas', kind: 'gas' },
    { from: 'sms', to: 'power', label: 'LD gas', kind: 'gas' },
    { from: 'power', to: 'utilities', label: 'Power + steam', kind: 'utility' },
    { from: 'utilities', to: 'sms', label: 'Oxygen', kind: 'utility' },
    { from: 'utilities', to: 'bf', label: 'Hot blast air', kind: 'utility' },
];

// Which plant node a role "belongs" to (department engineers)
export const ROLE_NODE = {
    BLAST_FURNACE_ENGINEER: 'bf',
    COKE_OVEN_ENGINEER: 'coke',
    SINTER_PLANT_ENGINEER: 'sinter',
    SMS_ENGINEER: 'sms',
    POWER_PLANT_ENGINEER: 'power',
    UTILITIES_ENGINEER: 'utilities',
};
