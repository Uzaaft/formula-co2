import { useState } from "react";
import Globe from "./Globe";
import type { Race } from "../data/types";
import { getEmissionsForRace, getTotalForRace } from "../data/emissions";

export default function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const emissions = selectedRace ? getEmissionsForRace(selectedRace.id) : null;
  const total = selectedRace ? getTotalForRace(selectedRace.id) : 0;

  return (
    <div className="app-layout">
      <aside className="panel panel-left">
        <h1>formulaco2</h1>
        <p className="subtitle">F1 Carbon Footprint Visualized</p>
        <div className="card">
          <div className="card-title">2024 Season Total</div>
          <div className="stat-value">
            168,720<span className="stat-unit">tCO₂e</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Races</div>
          <div className="stat-value">24</div>
        </div>
        <div className="card">
          <div className="card-title">vs 2018 Baseline</div>
          <div className="stat-value" style={{ color: "var(--color-success)" }}>
            -26%
          </div>
        </div>
      </aside>

      <main className="globe-container">
        <Globe onSelectRace={setSelectedRace} selectedRace={selectedRace} />
      </main>

      <aside className="panel panel-right">
        <h2>Selected Race</h2>
        {selectedRace && emissions ? (
          <div key={selectedRace.id}>
            <div className="card card-animate">
              <div className="card-title">{selectedRace.country}</div>
              <div className="stat-value" style={{ fontSize: "1.25rem" }}>
                {selectedRace.name}
              </div>
              <div style={{ color: "var(--color-text-muted)", marginTop: "0.75rem", fontSize: "0.9rem" }}>
                {selectedRace.circuit}
              </div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {new Date(selectedRace.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="card card-animate">
              <div className="card-title">Race Weekend Emissions</div>
              <div className="stat-value">
                {total.toLocaleString()}
                <span className="stat-unit">tCO₂e</span>
              </div>
            </div>
            <div className="card card-animate">
              <div className="card-title">Breakdown</div>
              <div style={{ marginTop: "0.5rem" }}>
                <div className="breakdown-row">
                  <span className="breakdown-label">Logistics</span>
                  <span className="breakdown-value">{emissions.logistics.toLocaleString()} tCO₂e</span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-label">Team Travel</span>
                  <span className="breakdown-value">{emissions.teamTravel.toLocaleString()} tCO₂e</span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-label">Event Ops</span>
                  <span className="breakdown-value">{emissions.eventOperations.toLocaleString()} tCO₂e</span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-label">Broadcast</span>
                  <span className="breakdown-value">{emissions.broadcast.toLocaleString()} tCO₂e</span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-label">Cars on Track</span>
                  <span className="breakdown-value">{emissions.carEmissions.toLocaleString()} tCO₂e</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 0 }}>Click a marker to view details</div>
          </div>
        )}
      </aside>
    </div>
  );
}
