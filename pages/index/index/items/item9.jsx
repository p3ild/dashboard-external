import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import _ from "lodash";
import { PROVINCE_NAME } from "../constant";
import { Skeleton } from "antd";
import { chartBuilder } from '../../../../core/ui/chartjsBuilder';
const { max } = _;
export default ({ loading, setLoading }) => {
    const ref = useRef(null);

    useEffect(() => {

        const province = PROVINCE_NAME.map(e => e.name);
        const labels = province;
        let dataSetCommune = {
            label: 'Tuyến xã',
            type: 'bar',
            data: province.map((e, idx) => faker.number.int({ min: 50, max: 80 })),
            borderColor: '#B9E6A1',
            backgroundColor: '#B9E6A1',
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: function (tooltipItems) {
                            let completenessPercentage = dataSetCompleteness.data[tooltipItems[0].dataIndex];
                            return ` Xã có báo cáo: %`;
                        }
                    }

                }
            },
            datalabels: {
                font: {
                    size: 8,
                }
            }
        };
        let dataSetDistrict = {
            label: 'Tuyến huyện',
            type: 'bar',
            data: province.map((e, idx) => faker.number.int({ min: 100, max: 300 })),
            borderColor: '#5FAE47',
            backgroundColor: '#5FAE47',
            datalabels: {
                font: {
                    size: 8
                }
            }
        };
        let dataSetProvince = {
            label: 'Tuyến tỉnh',
            type: 'bar',
            data: province.map((e, idx) => faker.number.int({ min: 200, max: 400 })),
            borderColor: '#2E6B1A',
            backgroundColor: '#2E6B1A',
            datalabels: {
                font: {
                    size: 8
                }
            }
        };


        let dataSetCompleteness = [
            {
                idGroup: 4,
                levelName: 'Cấp xã',
            },
            {
                idGroup: 3,
                levelName: 'Cấp huyện',
            },
            {
                idGroup: 2,
                levelName: 'Cấp tỉnh',
            }
        ].map(e => {
            return {
                ...e,
                type: 'scatter',
                label: 'Số phụ nữ đẻ được cán bộ y tế đỡ',
                data: province.map((e, idx) => faker.number.int({ min: 0, max: 100 })),
                backgroundColor: 'black',
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    offset: 1,
                    formatter: function (value, context) {
                        return value + '%';
                    },
                    color: function (context) {
                        return 'blue';
                    },
                },
            }
        });

        const data = {
            labels: labels,
            datasets: [
                dataSetProvince,
                dataSetDistrict,
                dataSetCommune,
                // dataSetCompleteness
            ]
        };

        const chartConfig = chartBuilder({
            type: 'bar',
            data: data,
            options: {
                scales: {
                    x: { stacked: true, },
                    y: {

                        suggestMax: max(dataSetCommune.data) + max(dataSetDistrict.data) + max(dataSetProvince.data) + 50,
                        stacked: true
                        // grid: {
                        //     display: false,
                        // }
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function (tooltipItem) {
                                let completenessPercentage = dataSetCompleteness?.[tooltipItem.datasetIndex]?.data[tooltipItem.dataIndex];
                                return `Tỉ lệ hoàn thành : ${completenessPercentage}%`
                            }
                        }

                    },

                    title: {
                        text: 'Việt Nam - 2024'
                    }
                }
            }
        });
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
                Chart.getChart(ref.current)?.destroy();
                new Chart(ref.current, chartConfig)
            }, 200);

        }, faker.number.int({ min: 1000, max: 3000 }));

    }, [])
    return (
        <div className="flex flex-col w-full h-full">
            <p className="text-xl font-bold" >{`9. Số phụ nữ đẻ được cán bộ y tế đỡ`}</p>
            <div className={'mt-1 mb-3 w-[200px]'}>
                <p className="whitespace-nowrap italic ">*Nguồn số liệu: Cơ sở y tế báo cáo theo Thông tư 37</p>
            </div>
            <div>
                <span className={`font-bold text-xl text-[#B9E6A1]`}>
                    70%
                </span>
                {` cơ sở y tế tuyến xã trên toàn quốc hoàn thành báo cáo`}
            </div>
            <div>
                <span className={`font-bold text-xl text-[#5FAE47]`}>
                    80%
                </span>
                {` cơ sở y tế tuyến huyện trên toàn quốc hoàn thành báo cáo`}
            </div>
            <div>
                <span className={`font-bold text-xl text-[#2E6B1A]`}>
                    90%
                </span>
                {` cơ sở y tế tuyến tỉnh trên toàn quốc hoàn thành báo cáo`}
            </div>
            <div className="h-[100%] p-2 mt-4 grow-1">
                <canvas ref={ref} />
            </div>

        </div >)
}