import { verify } from "crypto";
import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum ReportType {
  Increasing = "increasing",
  Decreasing = "decreasing",
}

interface Report {
  levels: number[];
  reportType?: ReportType;
  isSafe?: boolean;
}

function readInput(input: string[]): Report[] {
  return input.map(readInputLine);
}

function readInputLine(line: string): Report {
  return {
    levels: line.split(" ").map(Number),
  };
}

function enrichReports(reports: Report[]): Report[] {
  return reports.map(enrichReportType);
}

function enrichReportType(report: Report): Report {
  const { levels } = report;
  let reportType: ReportType;

  if (levels[0] < levels[1]) {
    reportType = ReportType.Increasing;
  } else {
    reportType = ReportType.Decreasing;
  }

  return {
    ...report,
    reportType,
  };
}

function verifyReports(reports: Report[]): Report[] {
  return reports.map(verifyReport);
}

function verifyReport(report: Report): Report {
  const { levels, reportType } = report;

  let isSafe = true;

  // Check if all the levels are either increasing or decreasing
  // And also, make sure that the steps difference is between 1 and 3
  for (let i = 0; i < levels.length - 1; i++) {
    const currentLevel = levels[i];
    const nextLevel = levels[i + 1];
    const step = Math.abs(nextLevel - currentLevel);

    if (step < 1 || step > 3) {
      isSafe = false;
      break;
    }

    if (
      (reportType === ReportType.Increasing && currentLevel >= nextLevel) ||
      (reportType === ReportType.Decreasing && currentLevel <= nextLevel)
    ) {
      isSafe = false;
      break;
    }
  }

  return {
    ...report,
    isSafe,
  };
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const reports = readInput(inputLines);
const enrichedReports = enrichReports(reports);
const verifiedReports = verifyReports(enrichedReports);
const safeReports = verifiedReports.filter((report) => report.isSafe);

console.log(safeReports.length);
