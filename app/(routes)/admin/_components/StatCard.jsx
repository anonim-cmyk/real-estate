import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";

// Definisi prop types
StatCard.propTypes = {
  type: PropTypes.oneOf(["appointments", "pending", "cancelled"]).isRequired,
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

function StatCard({ count = 0, label, icon, type }) {
  // Debugging: Cetak nilai type
  console.log("Type Value:", type);

  // Debugging: Cetak hasil penggabungan kelas
  const cardClasses = clsx("stat-card", {
    "bg-appointments": type === "appointments",
    "bg-pending": type === "pending",
    "bg-cancelled": type === "cancelled",
  });

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-4">
        {/* Render ikon */}
        <Image src={icon} height={32} width={32} alt={label} />
        <h2 className="text-32bold">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
      {/* Render label dan count */}
    </div>
  );
}

export default StatCard;
