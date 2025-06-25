# 9 Bus System Analyzer

This demo visualizes a simple load flow and state estimation for the IEEE 9‑bus power system. All logic is contained in the React component `LoadFlowCalculator.jsx`.

## Running

No build step is required. Open `index.html` in a browser or serve the repository with any static web server. The page loads React and Tailwind from CDNs and runs the component.

## Features

- **Preset System Model** – Bus and line parameters for the IEEE 9‑bus test system are embedded directly in the component.
- **Load Flow Simulation** – Displays pre‑computed voltage and power flow results, including total system losses and iteration count.
- **State Estimation** – Generates noisy measurements and performs a simplified state estimation highlighting bad data.
- **Interactive UI** – Switch between diagram view and detailed tables, adjust load values and export results as CSV files.

All calculations are mocked inside the component for demonstration purposes.
