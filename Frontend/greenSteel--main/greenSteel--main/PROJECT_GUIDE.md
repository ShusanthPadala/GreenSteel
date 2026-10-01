# GreenSteel — Enterprise Emission Monitoring

GreenSteel tracks gas emissions across an integrated steel plant, shows **how fast each emission is changing**, checks every reading against **emission limits**, and turns the data into **sustainability and ESG scores**.

The departments in a steel plant are linked: gases and materials made in one department are used in the next. That is why access is role-based. Each officer or engineer works on their own area, and can see how the departments connected to theirs are doing.

---

## Run it

**Backend** (Spring Boot, Java 25, MySQL database `greensteel` on `localhost:3306`):

```powershell
cd "Backend\GreenSteel-Backend"
$env:DB_PASSWORD = "your-mysql-root-password"
$env:JWT_SECRET  = "a-long-random-secret-of-at-least-32-characters"
.\mvnw.cmd spring-boot:run
```

**Frontend** (React + Vite):

```powershell
cd "Frontend\greenSteel--main\greenSteel--main"
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (permissions + emission analytics)
npm run build      # production build
```

---

## What each page does

| Page | Purpose |
|---|---|
| **Dashboard** | Plant KPIs and average COx / NOx / SOx / PM against their limits. The rest depends on the role: engineers see **their department, its emission rates and the departments linked to it**; officers and managers see every department, limit breaches and a "what to fix first" list. |
| **Plant Gas Flow** | Interactive map of the plant. Each department is coloured by its live status. Animated lines show where gases and materials go: coke-oven gas (COG), blast-furnace (BF) gas, steel-shop (LD) gas, sinter, hot metal, oxygen, steam. If a department is near or over its limits, every department it supplies is flagged **Upstream risk**. Click a department for its units and readings. |
| **Emission Records** | Every reading, coloured green / amber / red against its limit. Includes an **emission rate** card for each unit (change since the last reading, rate per day, last 7 days vs the week before, and a 10-reading trend line), date-range filters, column sorting and pages. |
| **Emission Types** | The pollutants being tracked, each with its **emission limit**. |
| **ESG** | Environmental, social and governance scores, **how the score is calculated** (same weights as the backend), how much each department contributes, and the units to fix first. |
| **Reports** | Builds a **CSV file** (every reading for a month, with its limit status) or a **printable PDF summary**. Each report you generate is also saved to the reports list. |
| Departments · Units · Users · Roles · Alerts · Settings | Managing plant data, plus your account details. |

### Emission limits

The defaults are typical reference values for stack emissions at an integrated steel plant:

| Pollutant | Default limit |
|---|---|
| COx | 500 ppm |
| NOx | 300 ppm |
| SOx | 300 ppm |
| PM | 50 mg/Nm³ |

A reading at **80% of its limit** is shown as *approaching limit*; at or above the limit it counts as a *breach*. To use your own plant's limits, set **Emission limit** on each Emission Type; it is stored in the database (`emission_types.limit_value`, added automatically the next time the backend starts). Defaults live in `src/constants/plantModel.js` (frontend) and `EmissionLimitService.java` (backend), so keep them in sync.

### Automatic alerts

Every time an emission reading is saved, the backend checks each pollutant against its limit:

- **At or above the limit:** a **WARNING** alert is raised.
- **At or above 125% of the limit:** the alert is **CRITICAL**.
- **Repeat breaches** update the open alert (keeping the worst reading) instead of creating duplicates.
- **Resolving:** alerts stay open until someone with permission clicks **Resolve** on the Alerts page (`PUT /alerts/{id}/resolve`).

### How the scores are calculated (from the backend)

- **Overall ESG** = (Environmental + Social + Governance) ÷ 3
- **Environmental** = 40% carbon index (average unit health score) + 20% water efficiency + 20% waste recycled + 20% renewable energy
- **Social** = 60% employee safety + 40% training hours
- **Governance** = 60% board compliance + 40% sustainability index
- On the dashboard, the **Sustainability** score is the average unit efficiency, and the **ESG Score** is the average unit health score.

---

## Roles and access

Every role is defined in one file on each side, and the two files must match:

- **Frontend:** `src/constants/permissions.js` controls the sidebar, which pages open, and which Add / Edit / Delete / Resolve buttons appear. If someone opens a page their role can't use, they're sent to the dashboard with a message.
- **Backend:** `security/access/AccessPolicy.java` enforces the same rules on the API, so calling the backend directly can't get around them. Department engineers can only add or change records, units and alerts belonging to **their own department**; the API answers anything else with a clear 403 message. Reading stays plant-wide on purpose, so everyone can see the departments that feed theirs.

| Role | Pages | Can change |
|---|---|---|
| SUPER_ADMIN | Everything | Everything, including resolving alerts |
| PLANT_ADMIN | All except Users and Roles | Units, emission records, reports; resolve alerts |
| Blast furnace, coke oven, sinter plant, SMS, power plant and utilities engineers | Dashboard, Plant Gas Flow, Units, Emission Records, Emission Types, Alerts, Settings | Add and edit emission records, and update unit status, and resolve alerts, **own department only** (no deleting) |
| ESG_OFFICER | + ESG, Reports | Reports (add, edit, delete) |
| ENVIRONMENTAL_OFFICER | + ESG, Reports | Add and edit emission records (all departments) and reports; resolve alerts |
| SAFETY_OFFICER | Dashboard, Plant Gas Flow, Units, ESG, Reports, Alerts, Settings | Add and edit reports; resolve alerts |
| MAINTENANCE_ENGINEER | Dashboard, Plant Gas Flow, Units, Emission Records, Alerts, Settings | Edit unit status |
| PRODUCTION_MANAGER | + Departments, ESG, Reports | Add and edit reports |
| QUALITY_ENGINEER | + Emission Types, Reports | Edit emission records; add and edit reports |

Demo logins: `superadmin@greensteel.com / Admin123`, `blast@greensteel.com / Engineer123`, `esg@greensteel.com / Officer123` (full list in the project brief).

---

## Code map (frontend)

```
src/
  constants/permissions.js    role → pages & actions
  constants/plantModel.js     pollutants, default limits, departments, gas flows
  utils/emissionAnalytics.js  limit checks, emission rates, department status, upstream risk
  hooks/usePlantData.js       loads units, records, limits, alerts (+ analysis), shared cache
  components/plant/           plant gas-flow map
  components/emissions/       rate cards, sparklines, ESG score breakdown
  components/reports/         CSV / PDF report generator
  components/three/           3D plant model (three.js)
  pages/                      one folder per page
  __tests__/                  unit tests
```
