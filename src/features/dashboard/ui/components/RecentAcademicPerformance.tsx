import React, { useState } from 'react';
import { SEMESTER_TRENDS } from './RecentAcademicPerformanceData';
import { RecentAcademicPerformanceHeader } from './RecentAcademicPerformanceHeader';
import { RecentAcademicPerformanceSummary } from './RecentAcademicPerformanceSummary';

export function RecentAcademicPerformance() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="col-span-12 lg:col-span-8 bg-white border border-neutral-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
      <RecentAcademicPerformanceHeader />

      {/* Grid containing Chart and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-grow min-h-[200px]">
        {/* Left Side: Custom HTML/SVG Bar Chart */}
        <div className="md:col-span-8 flex flex-col justify-between relative w-full h-[220px] pt-4 pr-2">
          <div className="flex-grow flex relative">
            {/* Y-Axis Ticks */}
            <div className="flex flex-col justify-between text-[10px] font-extrabold text-neutral-400 h-full pr-3 text-right select-none w-6 pb-2">
              <span>20</span>
              <span>18</span>
              <span>16</span>
              <span>14</span>
              <span>12</span>
              <span>10</span>
            </div>

            {/* Chart Area */}
            <div className="flex-grow relative h-full pb-2">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border-t border-neutral-100/80 w-full h-0" />
                ))}
              </div>

              {/* Vertical Bars Container */}
              <div className="absolute inset-x-4 bottom-2 top-0 flex justify-around items-end">
                {SEMESTER_TRENDS.map((entry, index) => {
                  const pct = Math.max(0, Math.min(100, ((entry.moyenne - 10) / 10) * 100));
                  return (
                    <div
                      key={entry.semester}
                      className="flex flex-col items-center relative group"
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onTouchStart={() => setHovered(index)}
                    >
                      {/* Interactive Tooltip Card */}
                      {hovered === index && (
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 bg-[#291715] text-white p-3 rounded-2xl shadow-xl border border-neutral-800 text-xs font-semibold space-y-1 min-w-[155px] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <p className="font-extrabold text-white/50 border-b border-neutral-800 pb-0.5 mb-1 uppercase tracking-widest text-[8px]">
                            {entry.semester}
                          </p>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] text-neutral-300">Moyenne :</span>
                            <span className="font-black text-white text-sm">{entry.moyenne.toFixed(2)}/20</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] text-neutral-300">Mention :</span>
                            <span className="font-black text-[#E3A857] uppercase text-[9px] tracking-widest">{entry.mention}</span>
                          </div>
                        </div>
                      )}

                      {/* Bar Visual representation with beautiful shadow & highlight */}
                      <div
                        className="w-11 sm:w-14 rounded-t-xl transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:brightness-105 relative shadow-md"
                        style={{
                          height: `${pct}%`,
                          backgroundColor: entry.color
                        }}
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-t-xl" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around pl-9 select-none shrink-0 border-t border-neutral-100 pt-2">
            {SEMESTER_TRENDS.map((entry) => (
              <div key={entry.semester} className="text-[10px] font-extrabold text-neutral-500 text-center uppercase tracking-wider w-24">
                {entry.semester}
              </div>
            ))}
          </div>
        </div>

        <RecentAcademicPerformanceSummary />
      </div>
    </section>
  );
}
