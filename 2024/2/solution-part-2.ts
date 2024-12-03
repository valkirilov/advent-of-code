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
  const verifiedReports = reports.map(verifyReport);
  const safeReports = verifiedReports.filter((report) => report.isSafe);
  const unsafeReports = verifiedReports.filter((report) => !report.isSafe);

  const toleratedUnsafeReports = verifyUnsafeReports(unsafeReports);

  return [...safeReports, ...toleratedUnsafeReports];
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

function verifyUnsafeReports(reports: Report[]): Report[] {
  return reports.map(verifyUnsafeReport);
}

function verifyUnsafeReport(report: Report): Report {
  // We should apply the same validation of the report as before, but when we remove one level
  for (let i = 0; i < report.levels.length; i++) {
    const levels = report.levels.filter((_, index) => index !== i);
    const enrichedReport = enrichReportType({ levels });
    const verifiedReport = verifyReport(enrichedReport);

    if (verifiedReport.isSafe) {
      return verifiedReport;
    }
  }

  return report;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const reports = readInput(inputLines);
const enrichedReports = enrichReports(reports);
const verifiedReports = verifyReports(enrichedReports);
const safeReports = verifiedReports.filter((report) => report.isSafe);

console.log(safeReports.length);
