
import React from "react";
import HomestayCard from "./HomestayCard";
import type { Homestay } from "./types";

interface HomestayGridProps {
  homestays: Homestay[];
}

const HomestayGrid = ({ homestays }: HomestayGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {homestays.map((homestay) => (
        <HomestayCard key={homestay.id} homestay={homestay} />
      ))}
    </div>
  );
};

export default HomestayGrid;
