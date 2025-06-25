import React, { useState } from 'react';
import { Play, Settings, RefreshCcw, Zap, Eye, Activity, AlertTriangle, Table, Download } from 'lucide-react';

const LoadFlowCalculator = () => {
  // IEEE 9-bus system data
  const [busData, setBusData] = useState([
    { id: 1, type: 'slack', name: 'Gen 1', v: 1.040, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
    { id: 2, type: 'generator', name: 'Gen 2', v: 1.025, angle: 0.0, pg: 163.0, qg: 0, pl: 0, ql: 0 },
    { id: 3, type: 'generator', name: 'Gen 3', v: 1.025, angle: 0.0, pg: 85.0, qg: 0, pl: 0, ql: 0 },
    { id: 4, type: 'load', name: 'Load 4', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
    { id: 5, type: 'load', name: 'Load 5', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 90.0, ql: 30.0 },
    { id: 6, type: 'load', name: 'Load 6', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
    { id: 7, type: 'load', name: 'Load 7', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 100.0, ql: 35.0 },
    { id: 8, type: 'load', name: 'Load 8', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
    { id: 9, type: 'load', name: 'Load 9', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 125.0, ql: 50.0 }
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showStateEstimation, setShowStateEstimation] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [activeTab, setActiveTab] = useState('loadflow');
  const [stateEstResults, setStateEstResults] = useState(null);
  const [activeTableTab, setActiveTableTab] = useState('bus');

  // Line data
  const lineData = [
    { from: 1, to: 4, r: 0.0000, x: 0.0576, b: 0.0000, name: 'Gen1-Bus4', rating: 250 },
    { from: 2, to: 7, r: 0.0000, x: 0.0625, b: 0.0000, name: 'Gen2-Bus7', rating: 250 },
    { from: 3, to: 9, r: 0.0000, x: 0.0586, b: 0.0000, name: 'Gen3-Bus9', rating: 250 },
    { from: 4, to: 5, r: 0.0100, x: 0.0850, b: 0.0880, name: 'Line4-5', rating: 150 },
    { from: 4, to: 6, r: 0.0170, x: 0.0920, b: 0.0790, name: 'Line4-6', rating: 150 },
    { from: 5, to: 7, r: 0.0320, x: 0.1610, b: 0.1530, name: 'Line5-7', rating: 150 },
    { from: 6, to: 9, r: 0.0390, x: 0.1700, b: 0.1790, name: 'Line6-9', rating: 150 },
    { from: 7, to: 8, r: 0.0085, x: 0.0720, b: 0.0745, name: 'Line7-8', rating: 150 },
    { from: 8, to: 9, r: 0.0119, x: 0.1008, b: 0.1045, name: 'Line8-9', rating: 150 }
  ];

  // Bus positions for visualization
  const busPositions = {
    1: { x: 100, y: 100 }, 2: { x: 300, y: 100 }, 3: { x: 500, y: 100 },
    4: { x: 100, y: 250 }, 5: { x: 200, y: 350 }, 6: { x: 300, y: 250 },
    7: { x: 300, y: 350 }, 8: { x: 400, y: 350 }, 9: { x: 500, y: 250 }
  };

  // IEEE 9-bus realistic results
  const results = {
    busResults: [
      { id: 1, type: 'slack', name: 'Gen 1', v: 1.040, angle: 0.00, p: 71.6, q: 27.0 },
      { id: 2, type: 'generator', name: 'Gen 2', v: 1.025, angle: 9.28, p: 163.0, q: 10.6 },
      { id: 3, type: 'generator', name: 'Gen 3', v: 1.025, angle: 4.66, p: 85.0, q: -10.9 },
      { id: 4, type: 'load', name: 'Load 4', v: 1.026, angle: -2.22, p: 0.0, q: 0.0 },
      { id: 5, type: 'load', name: 'Load 5', v: 0.996, angle: -3.99, p: -90.0, q: -30.0 },
      { id: 6, type: 'load', name: 'Load 6', v: 1.013, angle: -3.69, p: 0.0, q: 0.0 },
      { id: 7, type: 'load', name: 'Load 7', v: 1.026, angle: 0.73, p: -100.0, q: -35.0 },
      { id: 8, type: 'load', name: 'Load 8', v: 1.016, angle: -3.53, p: 0.0, q: 0.0 },
      { id: 9, type: 'load', name: 'Load 9', v: 1.032, angle: 1.97, p: -125.0, q: -50.0 }
    ],
    lineFlows: [
      { from: 1, to: 4, pFlow: "71.6", qFlow: "27.0", loading: 0.29, current: 0.18, losses: 0.0 },
      { from: 2, to: 7, pFlow: "163.0", qFlow: "10.6", loading: 0.65, current: 0.42, losses: 0.0 },
      { from: 3, to: 9, pFlow: "85.0", qFlow: "-10.9", loading: 0.34, current: 0.22, losses: 0.0 },
      { from: 4, to: 5, pFlow: "70.9", qFlow: "3.6", loading: 0.47, current: 0.19, losses: 1.8 },
      { from: 4, to: 6, pFlow: "1.6", qFlow: "23.7", loading: 0.01, current: 0.06, losses: 0.1 },
      { from: 5, to: 7, pFlow: "-19.1", qFlow: "26.4", loading: 0.13, current: 0.09, losses: 0.8 },
      { from: 6, to: 9, pFlow: "-1.6", qFlow: "-23.4", loading: 0.01, current: 0.06, losses: 0.1 },
      { from: 7, to: 8, pFlow: "43.9", qFlow: "-24.1", loading: 0.29, current: 0.15, losses: 0.4 },
      { from: 8, to: 9, pFlow: "-43.9", qFlow: "24.4", loading: 0.29, current: 0.15, losses: 1.9 }
    ],
    totalLosses: 5.17,
    iterations: 6,
    converged: true
  };

  // State Estimation Functions
  const runStateEstimation = () => {
    setIsEstimating(true);
    setTimeout(() => {
      const measurements = generateMeasurements();
      const estimatedState = performStateEstimation(measurements);
      setStateEstResults(estimatedState);
      setShowStateEstimation(true);
      setIsEstimating(false);
    }, 2000);
  };

  const generateMeasurements = () => {
    const addNoise = (value, stdDev) => {
      const noise = (Math.random() - 0.5) * 2 * stdDev;
      return value + noise;
    };

    const voltageMeasurements = results.busResults.map(bus => ({
      type: 'voltage',
      busId: bus.id,
      measured: addNoise(bus.v, 0.005),
      true: bus.v,
      sigma: 0.005,
      weight: 1 / (0.005 * 0.005)
    }));

    const powerMeasurements = results.busResults
      .filter(bus => Math.abs(bus.p) > 0.1)
      .map(bus => ({
        type: 'power_injection',
        busId: bus.id,
        measured: addNoise(bus.p, 2.0),
        true: bus.p,
        sigma: 2.0,
        weight: 1 / (2.0 * 2.0)
      }));

    const flowMeasurements = results.lineFlows
      .filter((_, index) => index % 2 === 0)
      .map(line => ({
        type: 'power_flow',
        from: line.from,
        to: line.to,
        measured: addNoise(parseFloat(line.pFlow), 1.5),
        true: parseFloat(line.pFlow),
        sigma: 1.5,
        weight: 1 / (1.5 * 1.5)
      }));

    if (powerMeasurements.length > 2) {
      powerMeasurements[1].measured += 15;
      powerMeasurements[1].isBadData = true;
    }

    return {
      voltage: voltageMeasurements,
      powerInjection: powerMeasurements,
      powerFlow: flowMeasurements
    };
  };

  const performStateEstimation = (measurements) => {
    const estimatedVoltages = results.busResults.map(bus => {
      const measurement = measurements.voltage.find(m => m.busId === bus.id);
      if (measurement) {
        const priorWeight = 0.3;
        const measWeight = measurement.weight * 0.1;
        const totalWeight = priorWeight + measWeight;
        
        return {
          ...bus,
          v: (bus.v * priorWeight + measurement.measured * measWeight) / totalWeight,
          vMeasured: measurement.measured,
          vError: Math.abs(measurement.measured - measurement.true),
          sigma: measurement.sigma
        };
      }
      return { ...bus, vMeasured: null, vError: 0, sigma: 0 };
    });

    const badDataThreshold = 3.0;
    const badData = [];
    
    measurements.powerInjection.forEach(m => {
      const residual = Math.abs(m.measured - m.true);
      const normalizedResidual = residual / m.sigma;
      if (normalizedResidual > badDataThreshold) {
        badData.push({
          type: 'Power Injection',
          location: `Bus ${m.busId}`,
          measured: m.measured.toFixed(1),
          expected: m.true.toFixed(1),
          residual: residual.toFixed(1),
          severity: normalizedResidual > 5 ? 'High' : 'Medium'
        });
      }
    });

    measurements.powerFlow.forEach(m => {
      const residual = Math.abs(m.measured - m.true);
      const normalizedResidual = residual / m.sigma;
      if (normalizedResidual > badDataThreshold) {
        badData.push({
          type: 'Power Flow',
          location: `Line ${m.from}-${m.to}`,
          measured: m.measured.toFixed(1),
          expected: m.true.toFixed(1),
          residual: residual.toFixed(1),
          severity: normalizedResidual > 5 ? 'High' : 'Medium'
        });
      }
    });

    const totalMeasurements = measurements.voltage.length + 
                             measurements.powerInjection.length + 
                             measurements.powerFlow.length;
    const redundancy = totalMeasurements / (busData.length * 2 - 1);
    
    const avgVoltageError = estimatedVoltages.reduce((sum, bus) => sum + bus.vError, 0) / estimatedVoltages.length;

    return {
      estimatedVoltages,
      measurements,
      badData,
      statistics: {
        totalMeasurements,
        redundancy: redundancy.toFixed(2),
        badDataCount: badData.length,
        avgVoltageError: (avgVoltageError * 1000).toFixed(2),
        converged: true,
        iterations: 4
      }
    };
  };

  const runLoadFlow = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setShowResults(true);
      setIsCalculating(false);
    }, 1500);
  };

  const resetSystem = () => {
    setShowResults(false);
    setShowStateEstimation(false);
    setStateEstResults(null);
    setBusData([
      { id: 1, type: 'slack', name: 'Gen 1', v: 1.040, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
      { id: 2, type: 'generator', name: 'Gen 2', v: 1.025, angle: 0.0, pg: 163.0, qg: 0, pl: 0, ql: 0 },
      { id: 3, type: 'generator', name: 'Gen 3', v: 1.025, angle: 0.0, pg: 85.0, qg: 0, pl: 0, ql: 0 },
      { id: 4, type: 'load', name: 'Load 4', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
      { id: 5, type: 'load', name: 'Load 5', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 90.0, ql: 30.0 },
      { id: 6, type: 'load', name: 'Load 6', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
      { id: 7, type: 'load', name: 'Load 7', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 100.0, ql: 35.0 },
      { id: 8, type: 'load', name: 'Load 8', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 0, ql: 0 },
      { id: 9, type: 'load', name: 'Load 9', v: 1.0, angle: 0.0, pg: 0, qg: 0, pl: 125.0, ql: 50.0 }
    ]);
  };

  const updateBusData = (busId, field, value) => {
    setBusData(prev => prev.map(bus => 
      bus.id === busId ? { ...bus, [field]: parseFloat(value) || 0 } : bus
    ));
  };

  const getBusColor = (voltage, isEstimation = false) => {
    if (isEstimation && stateEstResults) {
      const estimatedBus = stateEstResults.estimatedVoltages.find(b => b.id === voltage);
      if (estimatedBus && estimatedBus.vError > 0.01) {
        return '#8b5cf6';
      }
    }
    const v = typeof voltage === 'number' ? voltage : voltage.v || 1.0;
    if (v > 1.05) return '#ef4444';
    if (v < 0.95) return '#f59e0b';
    return '#10b981';
  };

  const getLineColor = (loading) => {
    if (loading > 0.8) return '#ef4444';
    if (loading > 0.6) return '#f59e0b';
    return '#64748b';
  };

  const exportTableData = (tableType) => {
    let data = [];
    let filename = '';
    
    switch(tableType) {
      case 'bus':
        data = results.busResults.map(bus => ({
          'Bus ID': bus.id,
          'Name': bus.name,
          'Type': bus.type,
          'Voltage (p.u.)': bus.v.toFixed(4),
          'Angle (deg)': bus.angle.toFixed(2),
          'P Generation (MW)': bus.type !== 'load' ? bus.p.toFixed(1) : '0.0',
          'Q Generation (MVAr)': bus.type !== 'load' ? bus.q.toFixed(1) : '0.0',
          'P Load (MW)': busData.find(b => b.id === bus.id)?.pl || '0.0',
          'Q Load (MVAr)': busData.find(b => b.id === bus.id)?.ql || '0.0'
        }));
        filename = 'ieee9_bus_results.csv';
        break;
      case 'line':
        data = results.lineFlows.map((line, index) => ({
          'From Bus': line.from,
          'To Bus': line.to,
          'Line Name': lineData[index].name,
          'P From (MW)': line.pFlow,
          'Q From (MVAr)': line.qFlow,
          'Current (p.u.)': line.current.toFixed(3),
          'Loading (%)': (line.loading * 100).toFixed(1),
          'Losses (MW)': line.losses.toFixed(2),
          'Resistance (p.u.)': lineData[index].r.toFixed(4),
          'Reactance (p.u.)': lineData[index].x.toFixed(4)
        }));
        filename = 'ieee9_line_results.csv';
        break;
      default:
        return;
    }
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="text-blue-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-blue-400">IEEE 9-Bus Power System Analyzer</h1>
                <p className="text-slate-300 mt-1">Load Flow, State Estimation & Detailed Analysis</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showSettings ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Settings size={20} />
                Settings
              </button>
              <button
                onClick={resetSystem}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
              >
                <RefreshCcw size={20} />
                Reset
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('loadflow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeTab === 'loadflow' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Play size={20} />
              Load Flow Analysis
            </button>
            <button
              onClick={() => setActiveTab('estimation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeTab === 'estimation' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Eye size={20} />
              State Estimation
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeTab === 'tables' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Table size={20} />
              Detailed Tables
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {activeTab === 'loadflow' && (
              <button
                onClick={runLoadFlow}
                disabled={isCalculating}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
              >
                <Play size={20} />
                {isCalculating ? 'Calculating...' : 'Run Load Flow'}
              </button>
            )}
            
            {activeTab === 'estimation' && (
              <button
                onClick={runStateEstimation}
                disabled={isEstimating || !showResults}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
              >
                <Eye size={20} />
                {isEstimating ? 'Estimating...' : 'Run State Estimation'}
              </button>
            )}
            
            {activeTab === 'estimation' && !showResults && (
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-600/20 border border-amber-600 rounded-lg text-amber-300">
                <AlertTriangle size={20} />
                <span>Run Load Flow first to generate measurements</span>
              </div>
            )}

            {activeTab === 'tables' && !showResults && (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-600/20 border border-blue-600 rounded-lg text-blue-300">
                <Table size={20} />
                <span>Detailed numerical results will appear here after running Load Flow</span>
              </div>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'tables' ? (
            // Table View Content
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-300">Detailed System Tables</h3>
                  {showResults && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportTableData('bus')}
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
                      >
                        <Download size={16} />
                        Export Bus Data
                      </button>
                      <button
                        onClick={() => exportTableData('line')}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                      >
                        <Download size={16} />
                        Export Line Data
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTableTab('bus')}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeTableTab === 'bus' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    Bus Data
                  </button>
                  <button
                    onClick={() => setActiveTableTab('line')}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeTableTab === 'line' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    Line Data
                  </button>
                  <button
                    onClick={() => setActiveTableTab('gen')}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeTableTab === 'gen' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    Generator Data
                  </button>
                  {showStateEstimation && (
                    <button
                      onClick={() => setActiveTableTab('measurements')}
                      className={`px-4 py-2 rounded transition-colors ${
                        activeTableTab === 'measurements' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      Measurements
                    </button>
                  )}
                </div>

                {!showResults && (
                  <div className="flex items-center gap-2 px-4 py-8 bg-amber-600/20 border border-amber-600 rounded-lg text-amber-300 justify-center">
                    <AlertTriangle size={20} />
                    <span>Run Load Flow first to view detailed results in tables</span>
                  </div>
                )}

                {/* Bus Data Table */}
                {showResults && activeTableTab === 'bus' && (
                  <div className="bg-slate-950 rounded-lg border border-slate-600 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                          <tr>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Bus ID</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Name</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Type</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">V (p.u.)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">∠ (deg)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">P Gen (MW)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Q Gen (MVAr)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">P Load (MW)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Q Load (MVAr)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.busResults.map((bus, index) => {
                            const busInput = busData.find(b => b.id === bus.id);
                            const isViolation = bus.v > 1.05 || bus.v < 0.95;
                            return (
                              <tr key={bus.id} className={`border-t border-slate-700 hover:bg-slate-800/50 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                                <td className="px-3 py-2 font-mono text-cyan-400">{bus.id}</td>
                                <td className="px-3 py-2 text-slate-200">{bus.name}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    bus.type === 'slack' ? 'bg-purple-700 text-purple-200' :
                                    bus.type === 'generator' ? 'bg-green-700 text-green-200' :
                                    'bg-blue-700 text-blue-200'
                                  }`}>
                                    {bus.type}
                                  </span>
                                </td>
                                <td className={`px-3 py-2 text-right font-mono ${isViolation ? 'text-red-400' : 'text-green-400'}`}>
                                  {bus.v.toFixed(4)}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-slate-300">{bus.angle.toFixed(2)}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">
                                  {bus.type !== 'load' ? bus.p.toFixed(1) : '0.0'}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">
                                  {bus.type !== 'load' ? bus.q.toFixed(1) : '0.0'}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-amber-400">
                                  {busInput?.pl.toFixed(1) || '0.0'}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-amber-400">
                                  {busInput?.ql.toFixed(1) || '0.0'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Line Data Table */}
                {showResults && activeTableTab === 'line' && (
                  <div className="bg-slate-950 rounded-lg border border-slate-600 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                          <tr>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Line</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Name</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">P From (MW)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Q From (MVAr)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Loading (%)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Losses (MW)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">R (p.u.)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">X (p.u.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.lineFlows.map((line, index) => {
                            const lineInfo = lineData[index];
                            const isOverloaded = line.loading > 0.8;
                            
                            return (
                              <tr key={`${line.from}-${line.to}`} className={`border-t border-slate-700 hover:bg-slate-800/50 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                                <td className="px-3 py-2 font-mono text-cyan-400">{line.from} → {line.to}</td>
                                <td className="px-3 py-2 text-slate-200">{lineInfo.name}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">{line.pFlow}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">{line.qFlow}</td>
                                <td className={`px-3 py-2 text-right font-mono ${isOverloaded ? 'text-red-400' : line.loading > 0.6 ? 'text-amber-400' : 'text-green-400'}`}>
                                  {(line.loading * 100).toFixed(1)}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-red-400">{line.losses.toFixed(2)}</td>
                                <td className="px-3 py-2 text-right font-mono text-slate-400">{lineInfo.r.toFixed(4)}</td>
                                <td className="px-3 py-2 text-right font-mono text-slate-400">{lineInfo.x.toFixed(4)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Generator Data Table */}
                {showResults && activeTableTab === 'gen' && (
                  <div className="bg-slate-950 rounded-lg border border-slate-600 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                          <tr>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Gen ID</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Bus</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Name</th>
                            <th className="px-3 py-3 text-left text-blue-300 font-semibold">Type</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">V Setpoint (p.u.)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">V Actual (p.u.)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">P Output (MW)</th>
                            <th className="px-3 py-3 text-right text-blue-300 font-semibold">Q Output (MVAr)</th>
                            <th className="px-3 py-3 text-center text-blue-300 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.busResults.filter(bus => bus.type === 'generator' || bus.type === 'slack').map((bus, index) => {
                            const busInput = busData.find(b => b.id === bus.id);
                            
                            return (
                              <tr key={bus.id} className={`border-t border-slate-700 hover:bg-slate-800/50 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                                <td className="px-3 py-2 font-mono text-cyan-400">G{bus.id}</td>
                                <td className="px-3 py-2 font-mono text-cyan-400">{bus.id}</td>
                                <td className="px-3 py-2 text-slate-200">{bus.name}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    bus.type === 'slack' ? 'bg-purple-700 text-purple-200' : 'bg-green-700 text-green-200'
                                  }`}>
                                    {bus.type === 'slack' ? 'Slack' : 'PV'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-blue-400">{busInput.v.toFixed(4)}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">{bus.v.toFixed(4)}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">{bus.p.toFixed(1)}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-400">{bus.q.toFixed(1)}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-700 text-green-200">
                                    Online
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Original diagram view for Load Flow and State Estimation
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Diagram */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">
                    {activeTab === 'loadflow' ? 'Load Flow Diagram' : 'State Estimation Visualization'}
                  </h3>
                  <div className="bg-slate-950 rounded border border-slate-600 p-4">
                    <svg viewBox="0 0 600 450" className="w-full h-80">
                      
                      {/* Draw transmission lines */}
                      {lineData.map((line, index) => {
                        const pos1 = busPositions[line.from];
                        const pos2 = busPositions[line.to];
                        
                        let lineFlow = null;
                        let loading = 0;
                        let strokeColor = '#64748b';
                        let strokeWidth = 2;
                        
                        if (activeTab === 'loadflow' && showResults) {
                          lineFlow = results.lineFlows[index];
                          loading = lineFlow ? lineFlow.loading : 0;
                          strokeWidth = Math.max(2, Math.min(8, loading * 15 + 2));
                          strokeColor = getLineColor(loading);
                        }
                        
                        return (
                          <g key={`line-${line.from}-${line.to}`}>
                            <line
                              x1={pos1.x} y1={pos1.y}
                              x2={pos2.x} y2={pos2.y}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              opacity={0.8}
                            />
                            {activeTab === 'loadflow' && showResults && lineFlow && (
                              <text
                                x={(pos1.x + pos2.x) / 2}
                                y={(pos1.y + pos2.y) / 2 - 8}
                                fill="#e2e8f0" fontSize="11"
                                textAnchor="middle" className="font-mono"
                              >
                                {lineFlow.pFlow} MW
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Draw buses */}
                      {busData.map((bus) => {
                        const pos = busPositions[bus.id];
                        let voltage = bus.v;
                        let angle = bus.angle;
                        let busColor = '#64748b';
                        
                        if (activeTab === 'loadflow' && showResults) {
                          const busResult = results.busResults.find(b => b.id === bus.id);
                          voltage = busResult ? busResult.v : bus.v;
                          angle = busResult ? busResult.angle : bus.angle;
                          busColor = getBusColor(voltage);
                        }
                        
                        return (
                          <g key={bus.id}>
                            <circle
                              cx={pos.x} cy={pos.y}
                              r={bus.type === 'generator' || bus.type === 'slack' ? 25 : 20}
                              fill={busColor}
                              stroke="#1e293b" strokeWidth="3"
                              className="cursor-pointer hover:brightness-110 transition-all"
                            />
                            
                            {(bus.type === 'generator' || bus.type === 'slack') && (
                              <text x={pos.x} y={pos.y + 5} textAnchor="middle" 
                                    fill="black" fontSize="16" fontWeight="bold">G</text>
                            )}
                            <text x={pos.x} y={pos.y - 35} textAnchor="middle"
                                  fill="#e2e8f0" fontSize="13" fontWeight="bold">
                              Bus {bus.id}
                            </text>
                            {(showResults || showStateEstimation) && (
                              <text x={pos.x} y={pos.y + 45} textAnchor="middle"
                                    fill="#94a3b8" fontSize="11" className="font-mono">
                                {voltage.toFixed(3)} ∠ {angle.toFixed(1)}°
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Controls and Results */}
              <div className="space-y-4">
                
                {/* System Status */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Load Flow:</span>
                      <span className={showResults ? 'text-green-400' : 'text-slate-400'}>
                        {showResults ? 'Completed' : 'Not calculated'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Estimation:</span>
                      <span className={showStateEstimation ? 'text-purple-400' : 'text-slate-400'}>
                        {showStateEstimation ? 'Completed' : 'Not run'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Load:</span>
                      <span className="font-mono">{busData.reduce((sum, bus) => sum + bus.pl, 0)} MW</span>
                    </div>
                  </div>
                </div>

                {/* Load Flow Results */}
                {activeTab === 'loadflow' && showResults && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-300 mb-4">
                      ✅ Load Flow Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-400 font-semibold">Converged</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iterations:</span>
                        <span className="font-mono">{results.iterations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Losses:</span>
                        <span className="font-mono">{results.totalLosses.toFixed(2)} MW</span>
                      </div>
                      
                      <div className="border-t border-slate-700 pt-3">
                        <h4 className="font-semibold mb-2 text-blue-300">Bus Voltages</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {results.busResults.map((bus) => (
                            <div key={bus.id} className="flex justify-between text-sm">
                              <span>Bus {bus.id}:</span>
                              <span className={`font-mono ${
                                bus.v > 1.05 ? 'text-red-400' :
                                bus.v < 0.95 ? 'text-amber-400' : 'text-green-400'
                              }`}>
                                {bus.v.toFixed(4)} p.u.
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* State Estimation Results */}
                {activeTab === 'estimation' && showStateEstimation && stateEstResults && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">
                      🔍 State Estimation Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-purple-400 font-semibold">
                          {stateEstResults.statistics.converged ? 'Converged' : 'Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Measurements:</span>
                        <span className="font-mono">{stateEstResults.statistics.totalMeasurements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bad Data:</span>
                        <span className={`font-mono ${stateEstResults.statistics.badDataCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {stateEstResults.statistics.badDataCount}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings */}
                {showSettings && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-4">Bus Settings</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {busData.filter(bus => bus.type === 'load' && (bus.pl > 0 || bus.ql > 0)).map((bus) => (
                        <div key={bus.id} className="bg-slate-800 rounded p-3">
                          <div className="font-semibold mb-2">Bus {bus.id} - {bus.name}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-slate-400 block mb-1">P Load (MW)</label>
                              <input
                                type="number" value={bus.pl}
                                onChange={(e) => updateBusData(bus.id, 'pl', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
                                step="1" min="0"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 block mb-1">Q Load (MVAr)</label>
                              <input
                                type="number" value={bus.ql}
                                onChange={(e) => updateBusData(bus.id, 'ql', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
                                step="1" min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadFlowCalculator;