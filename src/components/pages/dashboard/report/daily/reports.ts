export type ReportConfig = {
  id: string;
  name: string;
  description?: string;
};

export const dailyReports: ReportConfig[] = [
  {
    id: "rlt",
    name: "RLT",
    description: "Report RLT",
  },
  {
    id: "manufacture",
    name: "MANUFACTURE",
    description: "Report Manufacture",
  },
  {
    id: "adjcorecams",
    name: "ADJ CORE CAMS",
    description: "Report Adj Core Cams",
  },
  {
    id: "reposold",
    name: "REPOSOLD",
    description: "Report Reposold",
  },
  // {
  //   id: "booking",
  //   name: "BOOKING",
  //   description: "Report Booking",
  // },
];
