import { getLines } from '../common';

const SPLIT_STRING = ' ';
const ALLOWED_DIFFERENCE = {
    MIN: 1,
    MAX: 3,
};

type InputLine = string;
type Report = number;
type Reports = Report[];

enum ReportStatus {
    UNSAFE,
    SAFE,
}

enum Direction {
    DECREASE = -1,
    INCREASE = 1,
}

const parseInput = (line: InputLine): Reports => {
    return line.split(SPLIT_STRING).map(Number);
};

const parseInputs = (lines: InputLine[]): Reports[] => {
    return lines.map(parseInput);
};

const getDifference = (reports: Reports, i: number, j: number): number => {
    return reports[j] - reports[i];
};

const getOutOfRange = (reports: Reports, i: number, j: number): boolean => {
    const absoluteDifference = Math.abs(getDifference(reports, i, j));
    return (
        absoluteDifference > ALLOWED_DIFFERENCE.MAX || absoluteDifference < ALLOWED_DIFFERENCE.MIN
    );
};

const getAlternating = (direction: Direction, difference: number): boolean => {
    return direction * difference < 0;
};

const validateReport = (
    reports: Reports,
    direction: Direction,
    i: number,
    j = i + 1,
): ReportStatus => {
    const difference = getDifference(reports, i, j);
    const outOfRange = getOutOfRange(reports, i, j);
    const alternating = getAlternating(direction, difference);

    return outOfRange || alternating ? ReportStatus.UNSAFE : ReportStatus.SAFE;
};

const validateReports = (reports: Reports): ReportStatus => {
    let i = 0;
    let direction = reports[1] - reports[0] > 0 ? Direction.INCREASE : Direction.DECREASE;
    while (i < reports.length) {
        const status = validateReport(reports, direction, i);

        if (status === ReportStatus.UNSAFE) {
            return ReportStatus.UNSAFE;
        }
        i++;
    }

    return ReportStatus.SAFE;
};

const validationReportFilter = (reports: Reports) => (_, i) =>
    validateReports(reports.filter((_, j) => j !== i)) === ReportStatus.SAFE;

const reportsFilter = (reports: Reports): boolean => {
    return reports.filter(validationReportFilter(reports)).length > 0;
};

const data = parseInputs(getLines('input.txt'));
const wrongAnswers = data.filter((reports) => validateReports(reports) === ReportStatus.UNSAFE);
const result1 = data.length - wrongAnswers.length;
const result2 = result1 + wrongAnswers.filter(reportsFilter).length;

console.log(result1, result2);
