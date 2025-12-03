import { useState } from "react";
import Globe from "./Globe";
import type { Race } from "../data/types";
import { getEmissionsForRace, getTotalForRace } from "../data/emissions";

export default function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const emissions = selectedRace ? getEmissionsForRace(selectedRace.id) : null;
  const total = selectedRace ? getTotalForRace(selectedRace.id) : 0;

  return (
    <div className="relative h-screen w-screen bg-[#030305]">
      {/* Globe - Full screen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#08080c_0%,#030305_100%)]">
        <Globe onSelectRace={setSelectedRace} selectedRace={selectedRace} />
      </div>

      {/* Left floating cards */}
      <div className="absolute top-8 left-8 z-10 space-y-4 max-w-[300px]">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-white tracking-tight">
            formulaco2
          </h1>
          <p className="text-sm text-zinc-500">
            F1 Carbon Footprint Visualized
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 hover:bg-black/50 transition-colors duration-300">
          <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
            2024 Season Total
          </div>
          <div className="text-4xl font-semibold font-mono text-white tracking-tight">
            168,720
            <span className="text-base text-zinc-500 ml-2 font-normal tracking-normal">tCO₂e</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-5 flex-1 hover:bg-black/50 transition-colors duration-300">
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
              Races
            </div>
            <div className="text-3xl font-semibold font-mono text-white tracking-tight">24</div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-5 flex-1 hover:bg-black/50 transition-colors duration-300">
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
              vs 2018
            </div>
            <div className="text-3xl font-semibold font-mono text-emerald-400 tracking-tight">-26%</div>
          </div>
        </div>
      </div>

      {/* Right floating cards - Selected race */}
      {selectedRace && emissions && (
        <div key={selectedRace.id} className="absolute top-8 right-8 z-10 space-y-4 max-w-[320px]">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 animate-fade-in">
            <div className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-3">
              {selectedRace.country}
            </div>
            <div className="text-2xl font-semibold text-white mb-3 leading-tight">
              {selectedRace.name}
            </div>
            <div className="text-base text-zinc-400">{selectedRace.circuit}</div>
            <div className="text-sm text-zinc-500 mt-1">
              {new Date(selectedRace.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 animate-fade-in-delay-1">
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
              Race Weekend Emissions
            </div>
            <div className="text-4xl font-semibold font-mono text-white tracking-tight">
              {total.toLocaleString()}
              <span className="text-base text-zinc-500 ml-2 font-normal tracking-normal">tCO₂e</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 animate-fade-in-delay-2">
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">
              Breakdown
            </div>
            <div className="space-y-3">
              {[
                { label: "Logistics", value: emissions.logistics, color: "text-orange-400" },
                { label: "Team Travel", value: emissions.teamTravel, color: "text-blue-400" },
                { label: "Event Ops", value: emissions.eventOperations, color: "text-purple-400" },
                { label: "Broadcast", value: emissions.broadcast, color: "text-cyan-400" },
                { label: "Cars on Track", value: emissions.carEmissions, color: "text-red-400" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex justify-between items-center"
                >
                  <span className="text-base text-zinc-400">{label}</span>
                  <span className={`text-base font-mono font-medium ${color}`}>
                    {value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hint when no race selected */}
      {!selectedRace && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/40 backdrop-blur-xl rounded-full px-6 py-3">
            <span className="text-sm text-zinc-400">Click a marker to view race details</span>
          </div>
        </div>
      )}
    </div>
  );
}
