# UB Solars KW Calculator

Public TNEB solar sizing tool — no login required.

## Features

- **By bill** — estimate units and suggested kW from bimonthly bill amount
- **By units** — min / avg / max from multiple readings → kW suggestions
- **Try kW sizes** — compare estimated EB bills at different solar capacities (1 kW, 3 kW, 5 kW, etc.)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

See [DEPLOY.md](./DEPLOY.md) for GitHub (personal account) and Vercel/Netlify setup.


## Formula

- Suggested kW = bimonthly units ÷ 60 days ÷ 4 units/kW/day
- Solar offset = kW × 4 × 60 bimonthly units
- Bill after solar = TNEB energy charge on  (consumption − offset)
