
import { isInteger, isEqual } from "lodash";


import { format, parse, isBefore, isAfter } from "date-fns";
import * as dateFns from "date-fns";

export const validConfig = {
    valid: ({ data, colOptions, targetColumnData, currentCellIndex, rowIdx, setTourConfig }) => {
        return {
            boolean: true,
            data
        }
    },
    emptyOrUndefined: ({ data, canBeEmpty, colOptions, targetColumnData, currentCellIndex, rowIdx, setTourConfig }) => {
        canBeEmpty = [undefined, true].includes(canBeEmpty);
        let err = ['Trường dữ liệu bắt buộc'];
        return err
    },
    date: ({ data, minLength, sourceFormat, targetFormat
    }) => {
        let isValid = true;
        let textErr;
        let err = [];
        let config = { data }
        if (sourceFormat) { config.sourceFormat = sourceFormat }
        if (targetFormat) { config.targetFormat = targetFormat }
        let objectMoment = convertDateToDHIS({ data });
        let objectDhisFormat = convertDateToDHIS({ ...config, isFormat: true });

        if (minLength && minLength < 10) {
            isValid = false;
            textErr = 'Sai định dạng';

        } else {
            try {
                switch (true) {
                    case !objectMoment: {
                        isValid = false;
                        textErr = 'Sai định dạng';
                        break;
                    }
                    case !objectMoment.isValid(): {
                        isValid = false;
                        textErr = 'Sai định dạng(Yêu cầu: Ngày/Tháng/Năm)';
                        break;
                    }
                    case !objectMoment.isAfter('1900-01-01', 'year') || !objectMoment.isBefore(moment()): {
                        textErr = 'Không được trước năm 1900 và ngày trong tương lai';
                        isValid = false;
                        break;
                    }
                    default:
                        break;
                }
            } catch (e) {
                isValid = false
            }

        }

        if (!isValid) {
            err.push(textErr);
        }


        return {
            boolean: isValid,
            data,
            dataConverted: objectDhisFormat,
            err
        }
    },
    regex: ({ data, pattern, convertData }) => {
        let isValidate = data.match(new RegExp(pattern)) ? true : false;
        let err = ['Không đúng định dạng'];
        let dataConverted;
        if (isValidate) {
            dataConverted = convertData ? convertData(data) : data;
        }
        return {
            boolean: isValidate,
            data,
            err
        }
    },
    trueOnly: ({ data, formatTarget, colOptions }) => {
        // if (data.includes('/')) {

        // }
        let err = [], textErr;
        let isValid = true;
        let dataConverted;

        if (data && formatTarget && !formatTarget.includes((data + '').trim())) {
            isValid = false;
            textErr = 'Sai định dạng(Yêu cầu: x)';
            dataConverted = 'null';
        } else {
            dataConverted = 'true';
        }

        if (!isValid) {
            err.push(textErr);
        }

        return {
            boolean: isValid,
            data,
            dataConverted,
            err
        }
    },

    totalGreaterThanorEqualSumofElements({ data, colOptions, targetColumnData, currentCellIndex, rowIdx, onClick }) {

        let isValid = true;
        let err = [];

        try {
            isValid = isInteger(+data) && +data >= 0;
        } catch (e) {
            isValid = false
        }
        if (!isValid) {
            err.push('Sai định dạng(Yêu cầu: Số nguyên dương)');
        }

        return {
            boolean: isValid,
            data,
            err
        }
    },

    positiveInteger: ({ data, colOptions, targetColumnData, currentCellIndex, rowIdx, onClick }) => {
        let isValid = true;
        let err = [];
        try {
            isValid = isInteger(+data) && +data >= 0;
        } catch (e) {
            isValid = false
        }
        if (!isValid) {
            err.push('Sai định dạng(Yêu cầu: Số nguyên dương)');
        }
        return {
            boolean: isValid,
            data,
            err
        }
    },
    number: ({ data }) => {
        let isValid = true;
        let err = [];
        try {
            isValid = isNumeric(data) && +data >= 0;
        } catch (e) {
            isValid = false

        }
        if (!isValid) {
            err.push('Sai định dạng(Yêu cầu: Số dương)');
        }
        return {
            boolean: isValid,
            data,
            err
        }
    },
    dateApi: ({ data, sourceFormat,
        targetFormat = 'yyyy-MM-dd',
        ge,//'2024-04-01'
        messageGE,
        allowFeature = false,
        useRegex }) => {
        let isValid = true;
        let err = [];
        try {
            let dateParse = parse(data, sourceFormat, new Date());
            let today =
                parse(
                    format(new Date(), 'yyyy-MM-dd')
                    , "yyyy-MM-dd", new Date());

            if (
                !dateFns.isValid(dateParse)
                && (
                    useRegex && data && !data.match(new RegExp(useRegex))
                )
            ) {
                err.push(`Định dạng yêu cầu ${sourceFormat}`);
            }
            else {
                data = format(dateParse, targetFormat).toString();
            }

            if (
                //false
                !allowFeature
            ) {
                isAfter(dateParse, today)
                    && !isEqual(dateParse, today)
                    && err.push(`Không được nhập ngày tương lai`);
            }

            if (
                // false
                ge
            ) {
                (
                    isAfter(parse(ge, sourceFormat, new Date()), dateParse)
                    && !isEqual(parse(ge, sourceFormat, new Date()), dateParse)
                )
                    && err.push(`Không được nhập trước ngày ${messageGE || ge}`);
            }

        } catch (e) {
            isValid = false

        }

        return {
            boolean: err.length == 0 && isValid,
            data,
            err
        }
    },
    compareNumber: ({ colA, operation, colB, message, expression }) => {
        let rs = true;
        let err = [];
        if (colA && [''].includes(trim(colA))) colA = 0;
        if (colB && [''].includes(trim(colB))) colB = 0;
        expression = (expression || `${colA}${operation}${colB}`)?.replace(/undefined/g, 0);
        try {
            let mExpression = expression || `${colA}${operation}${colB}`;
            rs = eval(mExpression);
            if (!rs) err.push(message)

        } catch (e) {
            rs = false;
            err.push(`Sai định dạng`);
        };
        return {
            boolean: rs,
            err
        };
    },
    /**
     * 
     * @param {*} validates : Array each validate 
     * @param {*} enablePriority : If true, apply priority to validation by index of validation in array. Stop execute other validation if current validation return false
     * @returns 
     */
    multiValidate: ({ validates, data, enablePriority }) => {
        let isValid = true;
        let err = [];
        let skipByPriority = false;
        validates.forEach((e, idx) => {
            !skipByPriority && e.err.length != 0 && err.push(e.err.join());
            if (enablePriority && e.err.length != 0) skipByPriority = true;
        })
        if (err.length != 0) {
            isValid = false;
        }
        return {
            boolean: isValid,
            err: err.filter(e => ![undefined, ''].includes(e)),
            data
        }
    },
}

export const findValueDataConvertedByKey = ({ key, dataConverted }) => {
    return dataConverted.find(e => e.key == key)
}

