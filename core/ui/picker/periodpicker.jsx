import React, { useRef, useState } from 'react';
import { DatePicker, Divider, Select } from 'antd';
import dayjs from 'dayjs';
import { FaCheckCircle } from "react-icons/fa";
import _ from 'lodash';
import { eachMonthOfInterval, eachQuarterOfInterval, eachWeekOfInterval, eachYearOfInterval, format, parse } from 'date-fns';

const { isArray } = _;
export const PERIOD_TYPE = {
  'date': 'date',
  'date2': 'date2',
  'week': 'week',
  'week2': 'week2',
  'month': 'month',
  'month2': 'month2',
  'year2': 'year2',
  'year': 'year',
  'quarter': 'quarter',
  'quarter2': 'quarter2',
  'sixMonth': 'sixMonth',
}

const { RangePicker } = DatePicker;



const PeriodPicker = (props) => {
  let {
    periodType,
    placeholder,
    inputFormat,
    outputFormat,
    labelFormat,
    onChange,
    className,
    rangeLimit,
    prefix,
    combinePrefix = false, // Display prefix and default prefix together 

    antdOpts
  } = props;
  if (!periodType) { return }
  let fromTo = periodType.includes('2');
  periodType = periodType.split('2')[0];

  let genOutput;

  let picker = periodType;
  let defaultPrefix = '';
  switch (periodType) {
    case PERIOD_TYPE.date:
      defaultPrefix = '';
      inputFormat = `[${defaultPrefix} ]` + "DD-MM-YYYY";
      outputFormat = 'YYYY-MM-DD';//Custom Format
      // outputFormat = 'YYYYMMDD';//DHIS Format
      labelFormat = inputFormat;

      break;
    case PERIOD_TYPE.week:
      defaultPrefix = 'tuần'
      inputFormat = `[${defaultPrefix} ]` + "ww-YYYY";
      outputFormat = 'YYYY[W]ww';
      labelFormat = inputFormat;
      genOutput = ({ start, end }) => {
        let outputFormat = end
          ? eachWeekOfInterval({
            start: start.dayjs?.toDate(),
            end: end.dayjs?.toDate(),
          }).map((e) => {
            return dayjs(e).format(`YYYY[W]ww`)
          })
          : [
            start.outputFormat
          ];
        let errors = []
        if (rangeLimit && outputFormat.length > rangeLimit) { errors.push(`Không hỗ trợ truy vấn quá ${rangeLimit} ${defaultPrefix}(Đã chọn ${outputFormat.length} ${defaultPrefix})  `) }

        return {
          outputFormat: outputFormat.join(';'),
          errors
        };
      }
      break;
    case PERIOD_TYPE.month:
      defaultPrefix = 'tháng'
      outputFormat = 'YYYYMM';
      inputFormat = `[${defaultPrefix} ]` + 'MM-YYYY';
      labelFormat = inputFormat;
      rangeLimit = 12;
      genOutput = ({ start, end }) => {
        let outputFormat = end
          ? eachMonthOfInterval({
            start: start.dayjs?.toDate(),
            end: end.dayjs?.toDate(),
          }).map((e) => {
            return format(e, 'yyyyMM')
          })
          : [
            start.outputFormat
          ];
        let errors = []
        if (rangeLimit && outputFormat.length > rangeLimit) { errors.push(`Không hỗ trợ truy vấn quá ${rangeLimit} ${defaultPrefix}(Đã chọn ${outputFormat.length} ${defaultPrefix})  `) }

        return {
          outputFormat: outputFormat.join(';'),
          errors
        };
      }
      break;

    case PERIOD_TYPE.year:
      defaultPrefix = 'năm'
      inputFormat = `[${defaultPrefix} ]` + 'YYYY';
      outputFormat = 'YYYY';
      labelFormat = inputFormat
      rangeLimit = 2;
      genOutput = ({ start, end }) => {
        let outputFormat = end
          ? eachYearOfInterval({
            start: start.dayjs?.toDate(),
            end: end.dayjs?.toDate(),
          }).map((e) => {
            return format(e, 'yyyy')
          })
          : [
            start.outputFormat
          ];
        let errors = [];
        if (rangeLimit && outputFormat.length > rangeLimit) { errors.push(`Không hỗ trợ truy vấn quá ${rangeLimit} ${defaultPrefix}(Đã chọn ${outputFormat.length} ${defaultPrefix})  `) }
        return {
          outputFormat: outputFormat.join(';'),
          errors
        };
      }
      break;
    case PERIOD_TYPE.quarter:
      defaultPrefix = 'quý'
      inputFormat = `[${defaultPrefix} ]` + 'Q-YYYY';
      outputFormat = 'YYYY[Q]Q';
      labelFormat = inputFormat;
      rangeLimit = 8
      genOutput = ({ start, end }) => {
        let outputFormat = end
          ? eachQuarterOfInterval({
            start: start.dayjs?.toDate(),
            end: end.dayjs?.toDate(),
          }).map((e) => {
            return format(e, `yyyy'Q'Q`)
          })
          : [
            start.outputFormat
          ];
        let errors = []
        if (rangeLimit && outputFormat.length > rangeLimit) { errors.push(`Không hỗ trợ truy vấn quá ${rangeLimit} ${defaultPrefix}(Đã chọn ${outputFormat.length} ${defaultPrefix})  `) }

        return {
          outputFormat: outputFormat.join(';'),
          errors
        };
      }
      break;

    case periodType === 'sixMonth':
      break;


    default: break;
  }

  const handleChange = (value) => {
    let [startValue, endValue] = isArray(value) ? value : [value]
    if (onChange) {
      const [
        startDayJS,
        endDayJS
      ] = [
          startValue ? dayjs(startValue) : undefined,
          endValue ? dayjs(endValue) : undefined
        ];
      const preFormat = {
        fromTo,
        start: {
          dayjs: startDayJS,
          inputFormat: startDayJS.format(inputFormat),
          outputFormat: startDayJS.format(outputFormat),
          labelFormat: startDayJS.format(labelFormat)
        },
        end: endValue ? {
          dayjs: endDayJS,
          inputFormat: endDayJS.format(inputFormat),
          outputFormat: endDayJS.format(outputFormat),
          labelFormat: endDayJS.format(labelFormat)
        } : undefined
      }

      preFormat.result = genOutput ? genOutput(preFormat) : undefined;

      if (value) {
        onChange(preFormat);
      } else {
        onChange(null);
      }
    }
  };

  const opts = {
    picker: picker,
    onChange: handleChange,
    format: inputFormat,
    allowClear: true,
    style: { width: 'auto' },
    prefix: combinePrefix
      ? <div className='flex flex-row gap-2 items-center'>
        {prefix}
        {defaultPrefix}
      </div>
      : (prefix || defaultPrefix),
    placeholder: `chọn ` + ((placeholder === 'none' ? '' : (placeholder || defaultPrefix))),
    ...antdOpts
  }

  const isSixMonth = periodType == PERIOD_TYPE.sixMonth;
  if (isSixMonth)
    return <SixMonthlyPicker {...{
      ...props, ...opts, onChange
    }} />;
  return (
    <>
      {
        !fromTo
          ? <DatePicker
            {
            ...{
              className: '!w-fit ' + className,
              ...antdOpts,
              ...opts
            }} />
          : <RangePicker
            {
            ...{
              className: '!w-fit ' + className,
              ...antdOpts,
              ...opts
            }
            } />
      }
    </>
  );
};

export const SixMonthlyPicker = (props) => {
  let { periodType = 'year', inputFormat, outputFormat, labelFormat, onChange } = props;

  const [sixMonthYearValue, setSixMonthYearValue] = useState();
  const [sixMonthTypeValue, setSixMonthTypeValue] = useState();

  const [outputSelected, setOutputSelected] = useState();

  const onChangeLocal = ({
    start, end, // Handle period from antd picker
    value, option // handle period from <Select />
  }) => {

    const year = start?.outputFormat || sixMonthYearValue;
    const type = option || sixMonthTypeValue;

    if (start?.outputFormat) setSixMonthYearValue(year)
    if (option?.value) setSixMonthTypeValue(type);
    if (!year || !type) {
      return;
    }

    let result = {
      start: {
        inputFormat: year + type.value,
        outputFormat: year + type.value,
        labelFormat: `${type.label} ${year}`
      }

      //Todo: Handle select range
      // end: endValue ? {
      //   inputFormat: dayjs(endValue).format(inputFormat),
      //   outputFormat: dayjs(endValue).format(outputFormat),
      //   labelFormat: dayjs(endValue).format(labelFormat)
      // } : undefined

    }
    setOutputSelected(result);
    onChange(result)
  }
  return <div className='flex flex-col gap-1 mt-2 border border-1 p-1 border-rounded rounded-lg'>
    <PeriodPicker {
      ...{
        ...props,
        onChange: onChangeLocal,
        periodType: 'year',
        placeholder: '',//Prevent add placeholder two time. One from props, one from current
        className: '!w-fit',
        antdOpts: {
          variant: 'borderless'
        }
      }
    } />
    {false && <Divider className="!p-0 !m-0 mb-0 " />}

    <Select
      onChange={(value, option) => onChangeLocal({ value, option })}
      variant='borderless'
      size='middle'
      prefix={'Loại: '}
      placeholder={'Chọn kỳ 6 tháng'}
      options={[
        {
          label: `6 tháng đầu năm`,
          value: 'S1'
        },
        {
          label: `Cả năm`,
          value: 'S2'
        },
      ]}
    />

    {outputSelected?.start?.labelFormat && <>
      {false && <Divider className='!p-0 m-0' />}
      <p className='flex items-center gap-1 ml-3 font-bold'>Đã chọn: {outputSelected?.start?.labelFormat} <FaCheckCircle className='text-green-400' /></p>
    </>}


  </div>

}


export default PeriodPicker;