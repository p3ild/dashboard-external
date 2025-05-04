import { t } from "i18next"
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PROVINCE_NAME } from "../constant";
import { Skeleton } from "antd";
import _ from "lodash";
const { max } = _;

export default () => {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        const province = PROVINCE_NAME.map(e => e.name);
        const labels = province;
        let dataSetCommune = {
            label: 'Tỷ lệ suy dinh dưỡng trẻ dưới 5 tuổi',
            type: 'bar',
            data: province.map((e, idx) => faker.number.int({ min: 80, max: 150 })),
            borderColor: '#f97316',
            backgroundColor: '#f97316',
            datalabels: {
                anchor: 'end',
                align: 'start',
                font: {
                    size: 8,
                },
            }
        };

        let dataSetCommuneCompleteness = {
            type: 'scatter',
            label: 'Tỉ lệ hoàn thành biểu nhập',
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

        const data = {
            labels: labels,
            datasets: [
                dataSetCommune,
                // dataSetCommuneCompleteness
            ]
        };

        const chartConfig = {
            type: 'bar',
            data: data,
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowValues: false,
                layout: {
                    padding: {
                        top: 1,
                        right: 16,
                        bottom: 0,
                        left: 8
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 60,
                            minRotation: 30,
                            padding: 2,
                            autoSkip: false,
                            fontSize: '5px'
                        },
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: max(dataSetCommune.data) + 30,
                        // grid: {
                        //     display: false,
                        // }
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            footer: function (tooltipItems) {
                                let completenessPercentage = dataSetCommuneCompleteness.data[tooltipItems[0].dataIndex];
                                return `% Xã có báo cáo: ${completenessPercentage}%`;
                            }
                        }

                    },
                    datalabels: {
                        offset: -20,
                        formatter: value => `${value}`,
                        color: '#000',
                        font: function (context) {
                            var w = context.chart.width;
                            return {
                                size: w < 512 ? 10 : 12,
                            };
                        },
                        // display: function (context) {
                        //     return context.dataset.data[context.dataIndex] > 30;
                        // }
                    },
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        position: 'top',
                        text: 'Việt Nam - 2024',

                        // position: 'bottom',
                        // text: 'Số xã/phường đạt tiêu chí quốc gia về y tế xã Viêt Nam - 2024'
                    }
                }
            }
        };
        setTimeout(() => {
            setLoaded(true);
            setTimeout(() => {
                Chart.getChart(ref.current)?.destroy();
                new Chart(ref.current, chartConfig)
            }, 200);

        }, faker.number.int({ min: 1000, max: 3000 }));
    }, [])

    return (
        !loaded ? <Skeleton active /> : <div className="flex flex-col w-full h-full">
            <p className="text-xl font-bold" >{`7. Tỷ lệ suy dinh dưỡng trẻ dưới 5 tuổi`}</p>
            <div className={'mt-1 mb-3 w-[200px]'}>
                <p className="whitespace-nowrap italic ">*Nguồn số liệu: Viện Dinh dưỡng quốc gia</p>
                {/* <Skeleton.Input active block={true} title={false} size={'small'} rows={1} /> */}
            </div>

            <div className="h-[100%] p-2 mt-4 grow-1">
                <canvas ref={ref} />
            </div>

        </div>)
}