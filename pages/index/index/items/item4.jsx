import { t } from "i18next"
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PROVINCE_NAME } from "../constant";
import { Skeleton } from "antd";
import _ from "lodash";
import { chartBuilder } from "../../../../core/ui/chartjsBuilder";
const { max } = _;

export default ({ loading, setLoading }) => {
    const ref = useRef(null);


    useEffect(() => {
        const province = PROVINCE_NAME.map(e => e.name);
        const labels = province;
        let dataSetCommune = {
            label: 'Tỷ lệ trẻ dưới 1 tuổi tiêm chủng đầy đủ',
            type: 'bar',
            data: province.map((e, idx) => faker.number.int({ min: 80, max: 150 })),
            borderColor: '#3777f0',
            backgroundColor: '#3777f0',
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

        const chartConfig = chartBuilder({
            type: 'bar',
            data: data,
             options: {
                scales: {
                     
                    y: {
                        suggestedMax: max(dataSetCommune.data) + 30,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function (tooltipItem) {
                                let completenessPercentage = dataSetCommuneCompleteness.data[tooltipItem.dataIndex];
                                return `% Xã có báo cáo: ${completenessPercentage}%`;
                            }
                        }

                    },
                    datalabels: {
                        offset: -20,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        color: '#000',
                    },
                    title: {
                        text: 'Việt Nam - 2024',


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
            <p className="text-xl font-bold" >{`4. Tỷ lệ trẻ dưới 1 tuổi tiêm chủng đầy đủ`}</p>
            <div className={'mt-1 mb-3 w-[200px]'}>
                <p className="whitespace-nowrap italic ">*Nguồn số liệu: Chương trình tiêm chủng mở rộng</p>
                {/* <Skeleton.Input active block={true} title={false} size={'small'} rows={1} /> */}
            </div>

            <div className="h-[100%] p-2 mt-4 grow-1">
                <canvas ref={ref} />
            </div>

        </div>)
}