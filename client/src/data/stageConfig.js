export const stages = [
  {
    id: 1,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "ENQUIRY",
    staus:"Active, Inactive, Completed",
    startDate:"2024-01-01",
    endDate:"2024-01-15",
    substages: [
      { id: "1.1", name: "Project Assessment", day: "DAY 1" },
      { id: "1.2", name: "Cycle Time Study", day: "DAY 2" },
      { id: "1.3", name: "Submission of Quotation", day: "DAY 2.5" },
    ]
  },
  {
    id: 2,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "PURCHASE ORDER REVIEW & CONFIRMATION",
    staus:"Active, Inactive, Completed",
    startDate:"2024-01-16",
    endDate:"2024-01-30",
    substages: [
      { id: "2.1", name: "P.O Receipt", day: "DAY 3" },
      { id: "2.2", name: "P.O Acknowledgement", day: "DAY 3" },
      { id: "2.3", name: "Registration keeping in record", day: "DAY 6" },
      { id: "2.4", name: "P.O Master File Entry", day: "DAY 6" },
    ]
  },
  {
    id: 3,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "Manpower Arrangement",
    staus:"Active, Inactive, Completed",
    startDate:"2024-01-31",
    endDate:"2024-02-15",
    
    substages: [
      { id: "3.1", name: "Request for Arrangement of Manpower", day: "DAY 6.5" },
      { id: "3.2", name: "Recruitment Start & Deployment Plan", day: "DAY 7" }
    ]
  },
  {
    id: 4,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "Requirement for Inspection",
    staus:"Active, Inactive, Completed",
    startDate:"2024-02-16",
    endDate:"2024-02-28",
    substages: [
      { id: "4.1", name: "Request to customer for Resources", day: "DAY 10" },
      { id: "4.2", name: "Kick-off Confirmation", day: "DAY 10" }
    ]
  },
  {
    id: 5,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "Inspection Scheduling",
    staus:"Active, Inactive, Completed",
    startDate:"2024-03-01",
    endDate:"2024-03-15",
    substages: [
      { id: "5.1", name: "Shift Scheduling", day: "DAY 13" }
    ]
  },
  {
    id: 6,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "Ramp-Up",
    staus:"Active, Inactive, Completed",
    startDate:"2024-03-16",
    endDate:"2024-04-15",
    substages: [
      { id: "6.1", name: "Interaction with client", day: "DAY 6.5" },
      { id: "6.2", name: "Safety Practices", day: "DAY 6.5" },
      { id: "6.3", name: "QA Plan Review", day: "DAY 6.5" },
      { id: "6.4", name: "Induction Training Plan", day: "DAY 7" },
      { id: "6.5", name: "Work Instruction", day: "DAY 10" },
      { id: "6.6", name: "Availability fo Gauge & Instrument", day: "DAY 10" },
      { id: "6.7", name: "Review of Gauges/Instrument", day: "DAY 10" },
      { id: "6.8", name: "on Job Training Plan", day: "DAY 13" },
      { id: "6.9", name: "Finalizing of Reporting Format", day: "DAY 15" },
      { id: "6.10", name: "Mapping of Material routing in shop(Part wise PFD)", day: "DAY 15" },
      { id: "6.11", name: "final Inscpection Standard", day: "DAY 17" },
      { id: "6.12", name: "KPRT inscpection product identification mark", day: "DAY 17" }
    ]
  },
  {
    id: 7,
    department:"MR,HR,QUALITY,ACCOUNTS,MARKETING",
    departmentId:"cs.ersuraj@gmail.com",
    name: "Inspection Execution",
    staus:"Active, Inactive, Completed",
    startDate:"2024-04-16",
    endDate:"2024-05-15",
    substages: [
      { id: "7.1", name: "Final Inspection", day: "DAY 17" },
      { id: "7.2", name: "Review of Inspection Result", day: "DAY 17" },
      { id: "7.3.1", name: "Acknowledge to Customer", day: "DAY 17" },
      { id: "7.3.2", name: "Release Reports", day: "DAY 17" }
    ]
  }
];
