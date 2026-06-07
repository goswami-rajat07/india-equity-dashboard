ATHER_FINANCIALS = [
    {"fy": "FY2020", "year": 2020, "revenue": 45,   "net_profit": -147,  "ebitda": -130, "margin_pct": -326.7},
    {"fy": "FY2021", "year": 2021, "revenue": 290,  "net_profit": -344,  "ebitda": -295, "margin_pct": -118.6},
    {"fy": "FY2022", "year": 2022, "revenue": 408,  "net_profit": -344,  "ebitda": -275, "margin_pct": -84.3},
    {"fy": "FY2023", "year": 2023, "revenue": 1781, "net_profit": -864,  "ebitda": -650, "margin_pct": -48.5},
    {"fy": "FY2024", "year": 2024, "revenue": 1789, "net_profit": -1059, "ebitda": -780, "margin_pct": -59.2},
    {"fy": "FY2025", "year": 2025, "revenue": 2500, "net_profit": -800,  "ebitda": -500, "margin_pct": -32.0, "estimated": True},
]

ATHER_STOCK_PRICE = [
    {"fy": "FY2020", "year": 2020, "price": None, "listed": False},
    {"fy": "FY2021", "year": 2021, "price": None, "listed": False},
    {"fy": "FY2022", "year": 2022, "price": None, "listed": False},
    {"fy": "FY2023", "year": 2023, "price": None, "listed": False},
    {"fy": "FY2024", "year": 2024, "price": None, "listed": False},
    {"fy": "FY2025", "year": 2025, "price": 310,  "listed": True, "ipo_price": 321, "ipo_date": "May 6, 2025"},
]

ATHER_EARNINGS_GUIDANCE = [
    {
        "quarter": "Q4 FY2024 / IPO Prospectus",
        "date": "Mar 2024 – Apr 2025",
        "source": "SEBI RHP Filing",
        "highlights": [
            "Launched Ather Rizta (mass-market family scooter) to expand addressable market beyond premium segment",
            "Hosur Plant 2 capacity expansion targeting 1M+ units/year by FY2026",
            "Targeting EBITDA breakeven by FY2026 driven by operating leverage",
            "Battery cell localisation programme to reduce Bill of Materials by ~15%",
            "Ather Connect software subscription (₹2,000/yr) as a recurring revenue stream",
        ],
        "tone": "optimistic",
    },
    {
        "quarter": "Q1 FY2025",
        "date": "Apr – Jun 2025",
        "source": "Post-IPO Investor Update",
        "highlights": [
            "Rizta contributing 30–35% of monthly volumes, validating mass-market push",
            "Monthly run-rate reached 18,000–20,000 units, up 40% YoY",
            "Tier-2/3 city dealer network expansion: 300+ new outlets planned",
            "Gross margin improving on higher volumes and localisation benefits",
            "Management reiterated EBITDA breakeven guidance for FY2026",
        ],
        "tone": "positive",
    },
    {
        "quarter": "Q2 FY2025",
        "date": "Jul – Sep 2025",
        "source": "Earnings Call",
        "highlights": [
            "Launched 450 Apex (performance flagship) at ₹1.89L — targeting enthusiast segment",
            "Sri Lanka and Nepal international pilots live; exploring ASEAN expansion",
            "Target 25,000 units/month by Q4 FY2025",
            "Competitive intensity from Ola Electric, TVS iQube noted; pricing pressure in entry segment",
            "R&D capex guided at ₹400–500 Cr for Gen 3 battery platform development",
        ],
        "tone": "cautious",
    },
    {
        "quarter": "Q3 FY2025",
        "date": "Oct – Dec 2025",
        "source": "Earnings Call",
        "highlights": [
            "Volume guidance maintained despite broader EV 2W industry slowdown",
            "Gen 3 battery platform on track for FY2026 launch — higher energy density, faster charging",
            "Gross margin target of 10%+ by FY2026 reiterated; improvement visible in Q3",
            "Working capital cycle improvement: debtor days reduced from 18 to 11 days",
            "No near-term equity dilution planned; cash runway comfortable post-IPO proceeds",
        ],
        "tone": "neutral",
    },
]

ATHER_PROJECTIONS = {
    "base": [
        {"fy": "FY2025", "year": 2025, "revenue": 2500,  "net_profit": -800,  "margin_pct": -32.0, "share_price": 310},
        {"fy": "FY2026", "year": 2026, "revenue": 3400,  "net_profit": -408,  "margin_pct": -12.0, "share_price": 390},
        {"fy": "FY2027", "year": 2027, "revenue": 4700,  "net_profit": -94,   "margin_pct": -2.0,  "share_price": 510},
        {"fy": "FY2028", "year": 2028, "revenue": 6100,  "net_profit": 366,   "margin_pct": 6.0,   "share_price": 660},
        {"fy": "FY2029", "year": 2029, "revenue": 7800,  "net_profit": 1014,  "margin_pct": 13.0,  "share_price": 840},
    ],
    "bull": [
        {"fy": "FY2025", "year": 2025, "revenue": 2700,  "net_profit": -700,  "margin_pct": -26.0, "share_price": 350},
        {"fy": "FY2026", "year": 2026, "revenue": 4200,  "net_profit": -210,  "margin_pct": -5.0,  "share_price": 480},
        {"fy": "FY2027", "year": 2027, "revenue": 6000,  "net_profit": 300,   "margin_pct": 5.0,   "share_price": 680},
        {"fy": "FY2028", "year": 2028, "revenue": 8500,  "net_profit": 935,   "margin_pct": 11.0,  "share_price": 920},
        {"fy": "FY2029", "year": 2029, "revenue": 11500, "net_profit": 1955,  "margin_pct": 17.0,  "share_price": 1250},
    ],
    "bear": [
        {"fy": "FY2025", "year": 2025, "revenue": 2200,  "net_profit": -990,  "margin_pct": -45.0, "share_price": 260},
        {"fy": "FY2026", "year": 2026, "revenue": 2800,  "net_profit": -840,  "margin_pct": -30.0, "share_price": 280},
        {"fy": "FY2027", "year": 2027, "revenue": 3500,  "net_profit": -525,  "margin_pct": -15.0, "share_price": 310},
        {"fy": "FY2028", "year": 2028, "revenue": 4400,  "net_profit": -132,  "margin_pct": -3.0,  "share_price": 370},
        {"fy": "FY2029", "year": 2029, "revenue": 5300,  "net_profit": 318,   "margin_pct": 6.0,   "share_price": 450},
    ],
    "assumptions": [
        "India EV 2W market CAGR of ~35% (NITI Aayog forecasts)",
        "Ather market share maintained at 12–15% in premium + growing in mass segment via Rizta",
        "Base case revenue CAGR: 30% | Bull: 42% | Bear: 18%",
        "Margin improvement driven by operating leverage, localisation, and software revenue",
        "Share price derived using P/S multiple compression: 8x FY2025 → 4x FY2029 as revenue scales",
        "Bull case assumes Rizta captures >20% mass-market share + successful international expansion",
        "Bear case assumes sustained competition erodes premium segment share + delayed localisation",
        "FY2025 financials are estimated based on H1 run-rate and management guidance (not audited)",
        "No major equity dilution assumed in projection period",
        "Sources: Ather Energy SEBI RHP, Post-IPO Investor Presentations, Management Earnings Calls",
    ],
}

STOCK_METADATA = {
    "ATHENERGY": {
        "name": "Ather Energy Ltd",
        "exchange": "NSE",
        "sector": "Electric Vehicles",
        "industry": "EV Two-Wheelers",
        "founded": 2013,
        "headquarters": "Bengaluru, India",
        "ipo_date": "May 6, 2025",
        "ipo_price": 321,
        "market_cap_cr": 8700,
        "shares_outstanding_cr": 28.1,
        "promoters": ["Hero MotoCorp (39.7%)", "Tiger Global", "GIC Singapore"],
        "description": "Ather Energy is India's leading premium electric two-wheeler manufacturer, known for its technologically advanced scooters and proprietary fast-charging network (Ather Grid).",
        "current_price": 310,
        "day_change_pct": -1.2,
        "week_52_high": 346,
        "week_52_low": 248,
    }
}
