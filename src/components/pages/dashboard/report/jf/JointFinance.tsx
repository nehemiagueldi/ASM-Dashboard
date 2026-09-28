"use client";

import { useState } from "react";

type PeriodType = "single" | "multiple";

function JointFinance() {
  const [selectedReport, setSelectedReport] = useState("");
  const [periodType, setPeriodType] = useState<PeriodType>("single");
  const [generating, setGenerating] = useState(false);

  return <div>JointFinance</div>;
}

export default JointFinance;
