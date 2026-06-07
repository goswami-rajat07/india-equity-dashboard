// All monetary values in ₹ Crore, share price in ₹
// Ported from backend/data/tracker_data.py

interface Row {
  year: string;
  revenue: number;
  revenue_growth: number | null;
  pat_margin: number | null;
  net_profit: number;
  valuation_multiple: number | null;
  market_cap: number | null;
  shares_cr: number | null;
  share_price: number | null;
  estimated: boolean;
}

function r(
  year: string, rev: number, growth: number | null, margin: number | null,
  pat: number, multiple: number | null, mktcap: number | null,
  shares: number | null, price: number | null
): Row {
  return { year, revenue: rev, revenue_growth: growth, pat_margin: margin,
    net_profit: pat, valuation_multiple: multiple, market_cap: mktcap,
    shares_cr: shares, share_price: price, estimated: year.endsWith("E") };
}

export const COMPANY_META: Record<string, { name: string; sector: string; multiple_type: string }> = {
  ATHERENERG: { name: "Ather Energy",          sector: "EV Two-Wheelers",            multiple_type: "P/S" },
  BHARTIARTL: { name: "Bharti Airtel",         sector: "Telecom",                    multiple_type: "P/E" },
  CCAVENUE:   { name: "CC Avenue",             sector: "Payment Gateway",            multiple_type: "P/E" },
  CDSL:       { name: "CDSL",                  sector: "Capital Markets",            multiple_type: "P/E" },
  COFORGE:    { name: "Coforge",               sector: "IT Services",                multiple_type: "P/E" },
  DIXON:      { name: "Dixon",                 sector: "Electronics Mfg",            multiple_type: "P/E" },
  ETERNAL:    { name: "Eternal (Zomato)",      sector: "Quick Commerce",             multiple_type: "P/E" },
  GOLDBEES:   { name: "GoldBees ETF",          sector: "ETF – Gold",                 multiple_type: "N/A" },
  IDFCFIRSTB: { name: "IDFC First Bank",       sector: "Banking",                    multiple_type: "P/E" },
  IREDA:      { name: "IREDA",                 sector: "Renewable Energy Finance",   multiple_type: "P/E" },
  JWL:        { name: "Jupiter Wagons",        sector: "Railways / Capital Goods",   multiple_type: "P/E" },
  KAYNES:     { name: "Kaynes",                sector: "Electronics Mfg",            multiple_type: "P/E" },
  "M&M":      { name: "M&M",                  sector: "Automobiles",                multiple_type: "P/E" },
  MAZDOCK:    { name: "Mazagon Dock",          sector: "Defence / Shipbuilding",     multiple_type: "P/E" },
  MON100:     { name: "Motilal Nasdaq 100",    sector: "ETF – Global Tech",          multiple_type: "N/A" },
  NIFTYBEES:  { name: "NiftyBees ETF",         sector: "ETF – Nifty 50",             multiple_type: "N/A" },
  POLICYBZR:  { name: "PolicyBazaar",          sector: "Insurance Tech",             multiple_type: "P/E" },
  RELIANCE:   { name: "Reliance",              sector: "Conglomerate",               multiple_type: "P/E" },
  TECHD:      { name: "Tech Defense",           sector: "Defence / Technology",       multiple_type: "P/E" },
  VBL:        { name: "Varun Beverages",       sector: "FMCG / Beverages",           multiple_type: "P/E" },
  WAAREEENER: { name: "Waaree Energy",         sector: "Solar Energy",               multiple_type: "P/E" },
  WAAREERTL:  { name: "Waaree Renewable",      sector: "Renewable EPC",              multiple_type: "P/E" },
};

export const PORTFOLIO: Record<string, { qty: number; avg_cost: number; prev_close: number | null }> = {
  ATHERENERG: { qty: 1, avg_cost: 321,   prev_close: 1033  },
  BHARTIARTL: { qty: 1, avg_cost: 850,   prev_close: 1072  },
  CCAVENUE:   { qty: 1, avg_cost: 120,   prev_close: 152   },
  CDSL:       { qty: 1, avg_cost: 1000,  prev_close: null  },
  COFORGE:    { qty: 1, avg_cost: 5000,  prev_close: null  },
  DIXON:      { qty: 1, avg_cost: 18000, prev_close: 22840 },
  ETERNAL:    { qty: 1, avg_cost: 95,    prev_close: 203   },
  GOLDBEES:   { qty: 1, avg_cost: 50,    prev_close: null  },
  IDFCFIRSTB: { qty: 1, avg_cost: 60,    prev_close: null  },
  IREDA:      { qty: 1, avg_cost: 185,   prev_close: 128   },
  JWL:        { qty: 1, avg_cost: 200,   prev_close: null  },
  KAYNES:     { qty: 1, avg_cost: 2480,  prev_close: 3972  },
  "M&M":      { qty: 1, avg_cost: 3500,  prev_close: 4132  },
  MAZDOCK:    { qty: 1, avg_cost: 3000,  prev_close: 2086  },
  MON100:     { qty: 1, avg_cost: 80,    prev_close: null  },
  NIFTYBEES:  { qty: 1, avg_cost: 200,   prev_close: null  },
  POLICYBZR:  { qty: 1, avg_cost: 1200,  prev_close: 1742  },
  RELIANCE:   { qty: 1, avg_cost: 2200,  prev_close: 2375  },
  TECHD:      { qty: 1, avg_cost: 1000,  prev_close: null  },
  VBL:        { qty: 1, avg_cost: 500,   prev_close: null  },
  WAAREEENER: { qty: 1, avg_cost: 2800,  prev_close: 3160  },
  WAAREERTL:  { qty: 1, avg_cost: 800,   prev_close: null  },
};

export const TRACKER_DATA: Record<string, Row[]> = {
  POLICYBZR: [
    r("FY22", 1425.0,    null,     -0.5846, -833.0,    null,      null,       46.3,  null),
    r("FY23", 2558.0,    0.7951,   -0.1907, -488.0,    null,      null,       46.3,  null),
    r("FY24", 3438.0,    0.3440,    0.0186,   64.0,  1000.0,  64000.0,       46.3,  1280.0),
    r("FY25", 4977.0,    0.4476,    0.0709,  353.0,   250.0,  88250.0,       46.3,  1765.0),
    r("FY26",  6794.0,   0.365,     0.099,   670.0,   106.0,  70982.0,       46.3,  1534.0),
    r("FY27E",9137.77,   0.35,      0.104,   950.3,    80.0,  76026.3,       46.3,  1520.5),
    r("FY28E",12244.6,   0.34,      0.109,  1334.7,    70.0,  93426.4,       46.3,  1868.5),
    r("FY29E",16407.8,   0.34,      0.114,  1870.5,    60.0, 112229.2,       46.3,  2244.6),
    r("FY30E",21986.4,   0.34,      0.119,  2616.4,    50.0, 130819.3,       46.3,  2616.4),
    r("FY31E",27483.0,   0.25,      0.124,  3407.9,    40.0, 136315.9,       46.3,  2726.3),
  ],
  ETERNAL: [
    r("FY22",  4192.0,   null,    -0.2917, -1223.0,   null,      null,      764.0,  null),
    r("FY23",  7079.0,   0.6887,  -0.1372,  -971.0,   null,      null,      836.0,  null),
    r("FY24", 12114.0,   0.7113,   0.0290,   351.0,  450.0, 157950.0,      868.0,   182.0),
    r("FY25", 20243.0,   0.6710,   0.0260,   527.0,  350.0, 184450.0,      907.0,   203.4),
    r("FY26",  54364.0,   1.687,    0.0067,   366.0,  643.0, 235264.0,      919.0,   256.0),
    r("FY27E",92915.4,   0.70,     0.020,   1858.3,  200.0, 371661.5,      965.0,   385.1),
    r("FY28E",148664.6,  0.60,     0.030,   4459.9,  150.0, 668990.7,      965.0,   693.3),
    r("FY29E",208130.4,  0.40,     0.035,   7284.6,  100.0, 728456.5,      965.0,   754.9),
    r("FY30E",270569.6,  0.30,     0.035,   9469.9,   60.0, 568196.1,      965.0,   588.8),
    r("FY31E",324683.5,  0.20,     0.035,  11363.9,   50.0, 568196.1,      965.0,   588.8),
  ],
  DIXON: [
    r("FY22",  11679.0,  null,    0.016,    186.9,  null,      null,      59.3,    null),
    r("FY23",  13283.0,  0.137,   0.015,    199.2,  null,      null,      59.3,    null),
    r("FY24",  27021.0,  1.034,   0.017,    459.4,  170.0,  78000.0,     59.3,   13159.0),
    r("FY25",  58770.0,  1.175,   0.018,   1057.9,  130.0, 137500.0,     59.3,   23186.0),
    r("FY26",  48873.0,  -0.168,   0.034,   1644.0,   48.0,  79452.0,     69.5,   11432.0),
    r("FY27E",176310.0,  0.50,    0.022,   3878.8,   60.0, 232700.0,     59.3,   39240.0),
    r("FY28E",246834.0,  0.40,    0.024,   5924.0,   50.0, 296200.0,     59.3,   49950.0),
    r("FY29E",326022.5,  0.32,    0.026,   8476.6,   40.0, 339100.0,     59.3,   57200.0),
    r("FY30E",399847.3,  0.23,    0.028,  11195.7,   35.0, 391800.0,     59.3,   66080.0),
    r("FY31E",479816.8,  0.20,    0.030,  14394.5,   30.0, 431800.0,     59.3,   72850.0),
  ],
  RELIANCE: [
    r("FY14", 440893.0,  0.08,   0.054,  23566.0,  12.0, 282800.0,   3396.0,     833.0),
    r("FY15", 374952.0, -0.15,   0.058,  21617.0,  13.0, 280900.0,   3396.0,     828.0),
    r("FY16", 295762.0, -0.21,   0.062,  18351.0,  14.0, 256700.0,   3396.0,     756.0),
    r("FY17", 331024.0,  0.12,   0.064,  21277.0,  15.0, 319200.0,   3396.0,     940.0),
    r("FY18", 408265.0,  0.23,   0.073,  29638.0,  17.0, 503500.0,   3396.0,    1483.0),
    r("FY19", 622809.0,  0.53,   0.070,  43616.0,  14.0, 610600.0,   3396.0,    1799.0),
    r("FY20", 614928.0, -0.01,   0.054,  39354.0,  15.0, 590000.0,   6763.0,     873.0),
    r("FY21", 486326.0, -0.21,   0.068,  49128.0,  20.0, 982600.0,   6763.0,    1453.0),
    r("FY22", 721634.0,  0.48,   0.078,  60705.0,  25.0,1517600.0,   6763.0,    2245.0),
    r("FY23", 876965.0,  0.22,   0.081,  73670.0,  20.0,1473200.0,   6763.0,    2179.0),
    r("FY24", 899792.0,  0.03,   0.084,  75750.0,  22.0,1665400.0,   6763.0,    2463.0),
    r("FY25", 945000.0,  0.05,   0.086,  81270.0,  20.0,1625400.0,   6763.0,    2403.0),
    r("FY26", 1055780.0, 0.117,  0.091,  95754.0,  18.0,1747050.0,   6763.0,    1291.0),
    r("FY27E",1090000.0, 0.08,   0.095, 103550.0,  18.0,1863900.0,   6763.0,    2757.0),
    r("FY28E",1180000.0, 0.08,   0.100, 118000.0,  17.0,2006000.0,   6763.0,    2967.0),
    r("FY29E",1270000.0, 0.08,   0.104, 132080.0,  16.0,2113300.0,   6763.0,    3125.0),
    r("FY30E",1370000.0, 0.08,   0.108, 147960.0,  15.0,2219400.0,   6763.0,    3282.0),
    r("FY31E",1480000.0, 0.08,   0.112, 165760.0,  14.0,2320600.0,   6763.0,    3432.0),
  ],
  CCAVENUE: [
    r("FY20",   320.0,   null,   0.150,    48.0,   null,    null,      null,     null),
    r("FY21",   350.0,   0.094,  0.155,    54.3,   null,    null,      null,     null),
    r("FY22",   510.0,   0.457,  0.160,    81.6,   null,    null,      null,     null),
    r("FY23",   750.0,   0.471,  0.165,   123.8,   null,    null,      null,     null),
    r("FY24",  1050.0,   0.400,  0.170,   178.5,  100.0,  17850.0,    130.0,     137.3),
    r("FY25",  1400.0,   0.333,  0.180,   252.0,   80.0,  20160.0,    130.0,     155.1),
    r("FY26E", 1890.0,   0.350,  0.190,   359.1,   65.0,  23342.0,    130.0,     179.6),
    r("FY27E", 2551.5,   0.350,  0.200,   510.3,   55.0,  28066.5,    130.0,     215.9),
    r("FY28E", 3319.5,   0.300,  0.210,   697.1,   45.0,  31369.5,    130.0,     241.3),
    r("FY29E", 4145.0,   0.249,  0.215,   891.2,   40.0,  35648.0,    130.0,     274.2),
    r("FY30E", 4973.9,   0.200,  0.220,  1094.3,   35.0,  38300.0,    130.0,     294.6),
    r("FY31E", 5970.0,   0.200,  0.225,  1343.3,   30.0,  40299.0,    130.0,     310.0),
  ],
  BHARTIARTL: [
    r("FY20", 104461.0,  0.05,   0.022,   2294.4,  null,    null,   5540.0,     null),
    r("FY21", 104522.0,  0.001,  0.050,   5226.1,  null,    null,   5500.0,     null),
    r("FY22", 116547.0,  0.115,  0.079,   9204.8,  null,    null,   5700.0,     null),
    r("FY23", 139145.0,  0.194,  0.098,  13636.2,  null,    null,   5690.0,     null),
    r("FY24", 151858.0,  0.091,  0.126,  19134.3,  30.0, 574000.0, 5690.0,    1009.0),
    r("FY25", 169561.0,  0.117,  0.135,  22890.7,  27.0, 617800.0, 5690.0,    1086.0),
    r("FY26",  210973.0,  0.244,  0.160,  33823.0,  41.0,1387337.0, 5690.0,    1798.0),
    r("FY27E",222000.0,  0.149,  0.155,  34410.0,  22.0, 757000.0, 5690.0,    1331.0),
    r("FY28E",253000.0,  0.140,  0.165,  41745.0,  20.0, 835000.0, 5690.0,    1468.0),
    r("FY29E",287000.0,  0.134,  0.175,  50225.0,  18.0, 904100.0, 5690.0,    1589.0),
    r("FY30E",323000.0,  0.125,  0.185,  59755.0,  16.0, 956100.0, 5690.0,    1681.0),
    r("FY31E",360000.0,  0.115,  0.195,  70200.0,  14.0, 982800.0, 5690.0,    1728.0),
  ],
  MAZDOCK: [
    r("FY20",  4924.0,   null,   0.060,   295.4,  null,    null,    199.8,     null),
    r("FY21",  5133.0,   0.042,  0.065,   333.6,  null,    null,    199.8,     null),
    r("FY22",  6101.0,   0.189,  0.070,   427.1,  null,    null,    199.8,     null),
    r("FY23",  7827.0,   0.283,  0.085,   665.3,  null,    null,    199.8,     null),
    r("FY24",  9611.0,   0.228,  0.105,  1009.2,   45.0,  45400.0,  199.8,    2272.0),
    r("FY25", 11200.0,   0.165,  0.115,  1288.0,   33.0,  42500.0,  199.8,    2127.0),
    r("FY26",  12840.0,   0.146,  0.190,  2436.0,   40.0,  97743.0,  403.3,    2423.0),
    r("FY27E",16128.0,   0.200,  0.125,  2016.0,   24.0,  48380.0,  199.8,    2421.0),
    r("FY28E",19350.0,   0.200,  0.128,  2476.8,   20.0,  49540.0,  199.8,    2480.0),
    r("FY29E",22552.0,   0.166,  0.130,  2931.8,   18.0,  52770.0,  199.8,    2641.0),
    r("FY30E",25922.0,   0.149,  0.132,  3421.7,   16.0,  54750.0,  199.8,    2740.0),
    r("FY31E",29810.0,   0.150,  0.133,  3964.7,   14.0,  55500.0,  199.8,    2778.0),
  ],
  WAAREEENER: [
    r("FY20",   900.0,   null,   0.040,    36.0,  null,    null,    null,      null),
    r("FY21",  1450.0,   0.611,  0.042,    60.9,  null,    null,    null,      null),
    r("FY22",  2300.0,   0.586,  0.050,   115.0,  null,    null,    null,      null),
    r("FY23",  5200.0,   1.261,  0.065,   338.0,  null,    null,    null,      null),
    r("FY24", 11632.0,   1.237,  0.090,  1047.0,   45.0,  47100.0,   null,    null),
    r("FY25", 14380.0,   0.236,  0.095,  1366.1,   33.0,  45100.0,  140.4,    3213.0),
    r("FY26",  26537.0,   0.846,  0.146,  3884.0,   23.0,  87820.0,  300.8,    3053.0),
    r("FY27E",28000.0,   0.400,  0.110,  3080.0,   24.0,  73920.0,  140.4,    5265.0),
    r("FY28E",38000.0,   0.357,  0.115,  4370.0,   20.0,  87400.0,  140.4,    6225.0),
    r("FY29E",48000.0,   0.263,  0.118,  5664.0,   18.0, 101952.0,  140.4,    7261.0),
    r("FY30E",57600.0,   0.200,  0.120,  6912.0,   16.0, 110592.0,  140.4,    7876.0),
    r("FY31E",67000.0,   0.163,  0.122,  8174.0,   14.0, 114436.0,  140.4,    8150.0),
  ],
  KAYNES: [
    r("FY20",   450.0,   null,   0.040,    18.0,  null,    null,    null,      null),
    r("FY21",   530.0,   0.178,  0.042,    22.3,  null,    null,    null,      null),
    r("FY22",   900.0,   0.698,  0.060,    54.0,  null,    null,    null,      null),
    r("FY23",  1454.0,   0.616,  0.075,   109.1,  null,    null,    null,      null),
    r("FY24",  1809.0,   0.244,  0.085,   153.8,  120.0,  18450.0,   52.4,    3521.0),
    r("FY25",  2300.0,   0.271,  0.095,   218.5,  100.0,  21850.0,   54.2,    4031.0),
    r("FY26",  3626.0,   0.577,  0.100,   364.0,   57.0,  20927.0,   67.0,    3122.0),
    r("FY27E", 4508.0,   0.400,  0.110,   495.9,   65.0,  32230.0,   54.2,    5947.0),
    r("FY28E", 5861.0,   0.300,  0.115,   673.9,   55.0,  37065.0,   54.2,    6840.0),
    r("FY29E", 7329.0,   0.250,  0.120,   879.5,   45.0,  39580.0,   54.2,    7302.0),
    r("FY30E", 8795.0,   0.200,  0.125,  1099.4,   40.0,  43980.0,   54.2,    8115.0),
    r("FY31E", 9674.5,   0.100,  0.130,  1257.7,   35.0,  44020.0,   54.2,    8122.0),
  ],
  ATHERENERG: [
    r("FY20",    49.0,   null,   -4.50,   -220.5,  null,    null,      3.0,     null),
    r("FY21",    80.0,   0.633,  -2.91,   -232.8,  null,    null,      3.0,     null),
    r("FY22",   409.0,   4.113,  -0.841,  -343.97, null,    null,      3.0,     null),
    r("FY23",  1781.0,   3.355,  -0.485,  -863.79, null,    null,     null,     null),
    r("FY24",  1754.0,  -0.015,  -0.604, -1059.42, null,    null,     29.0,     null),
    r("FY25",  2255.0,   0.286,  -0.360,  -811.80, 5.301, 11954.0,   37.0,   323.08),
    r("FY26",  3672.0,   0.628,  -0.141,  -517.0,  10.78, 39599.0,   38.31, 1033.0),
    r("FY27E", 7351.86,  0.750,  -0.250, -1837.97, 6.000, 44111.2,   38.31, 1155.0),
    r("FY28E",11762.98,  0.600,  -0.100, -1176.30, 5.400, 63520.1,   38.31, 1658.0),
    r("FY29E",17644.47,  0.500,  -0.050,  -882.22, 4.860, 85752.1,   38.31, 2238.0),
    r("FY30E",23820.04,  0.350,   0.050,  1191.00, 4.374,104188.8,   38.31, 2720.0),
    r("FY31E",30966.05,  0.300,   0.060,  1857.96, 8.000, 74318.5,   38.31, 1939.0),
  ],
  "M&M": [
    r("FY20",  48573.0,  0.04,   0.050,   2428.7,  null,    null,   1240.0,    null),
    r("FY21",  47354.0, -0.025,  0.040,   1894.2,  null,    null,   1240.0,    null),
    r("FY22",  60086.0,  0.269,  0.060,   3605.2,  null,    null,   1240.0,    null),
    r("FY23",  97608.0,  0.625,  0.080,   7808.6,  null,    null,   1240.0,    null),
    r("FY24", 131762.0,  0.350,  0.100,  13176.2,  27.0, 355800.0, 1240.0,   2869.0),
    r("FY25", 151022.0,  0.146,  0.115,  17352.5,  30.0, 520600.0, 1240.0,   4198.0),
    r("FY26",  198639.0,  0.315,  0.094,  18622.0,  20.0, 378095.0, 1240.0,   3040.0),
    r("FY27E",195000.0,  0.134,  0.125,  24375.0,  25.0, 609400.0, 1240.0,   4915.0),
    r("FY28E",220000.0,  0.128,  0.130,  28600.0,  22.0, 629200.0, 1240.0,   5074.0),
    r("FY29E",245000.0,  0.114,  0.132,  32340.0,  20.0, 646800.0, 1240.0,   5216.0),
    r("FY30E",270000.0,  0.102,  0.135,  36450.0,  18.0, 656100.0, 1240.0,   5291.0),
    r("FY31E",295000.0,  0.093,  0.137,  40415.0,  16.0, 646600.0, 1240.0,   5214.0),
  ],
  IREDA: [
    r("FY20",   2300.0,  null,   0.160,    368.0,  null,    null,    null,     null),
    r("FY21",   2500.0,  0.087,  0.162,    405.0,  null,    null,    null,     null),
    r("FY22",   2780.0,  0.112,  0.165,    458.7,  null,    null,    null,     null),
    r("FY23",   3500.0,  0.259,  0.172,    602.0,  null,    null,    null,     null),
    r("FY24",   5700.0,  0.629,  0.185,   1054.5,  30.0,  31640.0, 2693.5,    117.5),
    r("FY25",   8200.0,  0.439,  0.195,   1599.0,  22.0,  35180.0, 2693.5,    130.6),
    r("FY26",   8309.0,  0.013,  0.225,   1873.0,  18.5,  34674.0, 2809.0,    123.0),
    r("FY27E", 15990.0,  0.393,  0.205,   3277.9,  15.0,  49170.0, 2693.5,    182.6),
    r("FY28E", 21587.0,  0.350,  0.210,   4533.3,  13.0,  58930.0, 2693.5,    218.8),
    r("FY29E", 27063.0,  0.254,  0.210,   5683.2,  11.0,  62520.0, 2693.5,    232.1),
    r("FY30E", 32475.0,  0.200,  0.215,   6982.1,  10.0,  69820.0, 2693.5,    259.3),
    r("FY31E", 38000.0,  0.170,  0.215,   8170.0,   9.0,  73530.0, 2693.5,    273.1),
  ],
  CDSL: [
    r("FY20",  225.0,   null,   0.476,  107.0,  null,    null,  21.06,    null),
    r("FY21",  344.0,  0.529,   0.584,  201.0,  null,    null,  20.96,    null),
    r("FY22",  551.0,  0.602,   0.566,  312.0,  null,    null,  20.96,    null),
    r("FY23",  555.0,  0.007,   0.497,  276.0,  null,    null,  20.91,    null),
    r("FY24",  812.0,  0.463,   0.517,  420.0,  null,    null,  20.95,    null),
    r("FY25", 1082.0,  0.333,   0.486,  526.0,  null,    null,  20.86,    null),
    r("FY26", 1145.0,  0.058,   0.397,  455.0,  56.0, 25395.0,  20.85, 1218.0),
  ],
  COFORGE: [
    r("FY20",  4184.0,   null,   0.112,  468.0,  null,    null,  32.93,    null),
    r("FY21",  4663.0,  0.114,   0.100,  466.0,  null,    null,  30.98,    null),
    r("FY22",  6432.0,  0.380,   0.111,  715.0,  null,    null,  32.91,    null),
    r("FY23",  8015.0,  0.246,   0.093,  745.0,  null,    null,  32.79,    null),
    r("FY24",  9009.0,  0.124,   0.093,  836.0,  null,    null,  31.98,    null),
    r("FY25", 12051.0,  0.338,   0.078,  936.0,  null,    null,  38.54,    null),
    r("FY26", 16403.0,  0.361,   0.106, 1745.0,  31.0, 54065.0,  37.65, 1436.0),
  ],
  IDFCFIRSTB: [
    r("FY20", 16240.0,   null,  -0.175, -2843.0,  null,    null,  481.0,    null),
    r("FY21", 15968.0, -0.017,   0.030,   483.0,  null,    null,  568.0,    null),
    r("FY22", 17173.0,  0.075,   0.008,   132.0,  null,    null,  629.0,    null),
    r("FY23", 22728.0,  0.323,   0.109,  2485.0,  null,    null,  663.0,    null),
    r("FY24", 30325.0,  0.334,   0.097,  2942.0,  null,    null,  707.0,    null),
    r("FY25", 36502.0,  0.204,   0.041,  1490.0,  null,    null,  730.0,    null),
    r("FY26", 40549.0,  0.111,   0.040,  1611.0,  39.0, 62300.0,  861.5,   72.4),
  ],
  JWL: [
    r("FY21",   996.0,   null,   0.054,   54.0,  null,    null,   9.03,    null),
    r("FY22",  1178.0,  0.183,   0.042,   50.0,  null,    null,   8.94,    null),
    r("FY23",  2068.0,  0.756,   0.060,  125.0,  null,    null,  38.60,    null),
    r("FY24",  3641.0,  0.761,   0.091,  333.0,  null,    null,  41.30,    null),
    r("FY25",  3871.0,  0.063,   0.096,  373.0,  null,    null,  42.40,    null),
    r("FY26",  2539.0, -0.344,   0.072,  182.0,  65.0, 11871.0,  42.70,  278.0),
  ],
  TECHD: [
    r("FY21",    1.0,   null,   0.000,    0.0,  null,    null,   null,    null),
    r("FY22",    2.0,  1.000,   0.000,    0.0,  null,    null,   null,    null),
    r("FY23",    8.0,  3.000,   0.125,    1.0,  null,    null,   null,    null),
    r("FY24",   15.0,  0.875,   0.200,    3.0,  null,    null,   null,    null),
    r("FY25",   30.0,  1.000,   0.267,    8.0,  null,    null,   0.52,    null),
    r("FY26",   52.0,  0.733,   0.269,   14.0,  33.0,  467.0,  0.748,  624.0),
  ],
  VBL: [
    r("FY20",  6450.0,   null,   0.055,  357.0,  null,    null, 353.5,    null),
    r("FY21",  8823.0,  0.368,   0.085,  746.0,  null,    null, 348.6,    null),
    r("FY22", 13173.0,  0.493,   0.118, 1550.0,  null,    null, 336.2,    null),
    r("FY23", 16043.0,  0.218,   0.131, 2102.0,  null,    null, 332.1,    null),
    r("FY24", 20008.0,  0.247,   0.132, 2634.0,  null,    null, 343.4,    null),
    r("FY25", 21685.0,  0.084,   0.141, 3062.0,  null,    null, 341.0,    null),
    r("FY26",  6574.0, -0.697,   0.134,  879.0, 201.0,176996.0, 340.65, 523.0),
  ],
  WAAREERTL: [
    r("FY21",    8.0,   null,   0.250,    2.0,  null,    null,   9.09,    null),
    r("FY22",  154.0, 18.250,   0.130,   20.0,  null,    null,  10.20,    null),
    r("FY23",  342.0,  1.221,   0.172,   59.0,  null,    null,  10.33,    null),
    r("FY24",  876.0,  1.561,   0.166,  145.0,  null,    null,  10.38,    null),
    r("FY25", 1597.0,  0.823,   0.143,  229.0,  null,    null,  10.41,    null),
    r("FY26", 3331.0,  1.086,   0.145,  483.0,  21.0, 10124.0,  10.43,  970.0),
  ],
};

export function computeSignal(hist: Row[]): { label: "Buy" | "Hold" | "Sell"; score: number; reasons: string[] } {
  if (!hist.length) return { label: "Hold", score: 50, reasons: [] };

  let rev_growth: number | null = null;
  for (let i = hist.length - 1; i >= 0; i--) {
    if (hist[i].revenue_growth !== null) { rev_growth = hist[i].revenue_growth! * 100; break; }
  }
  const npm_latest = hist[hist.length - 1].pat_margin !== null ? hist[hist.length - 1].pat_margin! * 100 : null;
  const npm_prev = hist.length >= 3 && hist[hist.length - 3].pat_margin !== null ? hist[hist.length - 3].pat_margin! * 100 : null;
  const profitable = hist[hist.length - 1].net_profit > 0;
  let pe_latest: number | null = null;
  for (let i = hist.length - 1; i >= 0; i--) {
    if (hist[i].valuation_multiple !== null) { pe_latest = hist[i].valuation_multiple; break; }
  }

  let score = 50;
  const reasons: string[] = [];
  const g = rev_growth ?? 0;

  if (g >= 25) { score += 18; reasons.push(`Revenue compounding ${g.toFixed(0)}% YoY`); }
  else if (g >= 12) { score += 8; reasons.push(`Steady ${g.toFixed(0)}% revenue growth`); }
  else if (g < 5) { score -= 12; reasons.push(`Growth decelerating to ${g.toFixed(0)}%`); }

  if (npm_latest !== null && npm_prev !== null) {
    if (npm_latest - npm_prev > 1.5) { score += 14; reasons.push(`Margins expanding (${npm_prev.toFixed(1)}% → ${npm_latest.toFixed(1)}%)`); }
    else if (npm_latest - npm_prev < -1) { score -= 10; reasons.push("Margins compressing"); }
  }

  if (!profitable) { score -= 16; reasons.push("Still loss-making — watch path to profit"); }
  else { score += 6; }

  if (pe_latest !== null) {
    if (pe_latest > 90) { score -= 16; reasons.push(`Rich valuation at ${pe_latest.toFixed(0)}x earnings`); }
    else if (pe_latest > 55) { score -= 6; reasons.push(`Premium ${pe_latest.toFixed(0)}x multiple`); }
    else if (pe_latest < 28 && profitable) { score += 12; reasons.push(`Reasonable ${pe_latest.toFixed(0)}x multiple`); }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 64 ? "Buy" : score <= 42 ? "Sell" : "Hold";
  return { label, score, reasons: reasons.slice(0, 3) };
}
