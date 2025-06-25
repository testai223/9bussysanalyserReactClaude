# 9 Bus System Analyzer

This repository contains a single React component that implements a simple load flow and state estimation visualizer for the IEEE 9‑bus power system.

## Overview

`load_flow_calculator.tsx` defines the `LoadFlowCalculator` component. It stores an array of buses and transmission lines, renders a diagram of the network and provides controls to run a mock load flow calculation and a basic state estimation procedure.

### Key Features

- **Preset System Model** – Bus and line parameters for the IEEE 9‑bus test system are embedded directly in the component.
- **Load Flow Simulation** – When the user runs the calculation, the component displays pre‑computed voltage and power flow results, including total system losses and iteration count.
- **State Estimation** – Measurement data are generated with random noise and fed into a simplified estimation routine that highlights bad data and shows estimated voltages.
- **Interactive UI** – Users can switch between diagram view and detailed tables, adjust load values, and export bus or line results as CSV files.

The application does not include a backend; all calculations are mocked within the React component for demonstration purposes.

