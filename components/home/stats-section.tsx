"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: 500, label: "Community Members", suffix: "+" },
  { value: 50, label: "Dialysis Centers", suffix: "+" },
  { value: 100, label: "Success Stories", suffix: "+" },
  { value: 24, label: "Support Groups", suffix: "" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-[#22AA86]/5 dark:bg-[#22AA86]/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22AA86]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <CountingNumber value={stat.value} suffix={stat.suffix} />
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountingNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const increment = value / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start > value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-4xl md:text-5xl font-bold text-[#22AA86] mb-2">
      {count}
      {suffix}
    </div>
  );
}
