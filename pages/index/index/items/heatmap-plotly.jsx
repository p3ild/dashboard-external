import { flatten } from 'lodash';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { faker } from '@faker-js/faker';
import { use } from 'i18next';

const DoctorHeatmap = () => {

    const [dataConfig, setDataConfig] = useState({});

    useEffect(() => {
        // Dữ liệu tỷ lệ hoàn thành cập nhật dữ liệu (để hiển thị màu)
        const colorScale = [
            [10, '#ffffcc'],
            [20, '#ffeda0'],
            [40, '#feb24c'],
            [60, '#fd8d3c'],
            [80, '#f03b20'],
            [100, '#bd0026'],
        ];



        const yLabels = Array(63).fill(null).map((e, idx) => ('Tỉnh ' + (idx + 1)));
        const xLabels = ['Cấp tỉnh', 'Cấp huyện', 'Cấp xã'];

        const completionRate = yLabels.map(x => Array(3).fill(0).map(x => faker.number.float({ min: 0, max: 100 })));
        const zData = yLabels.map(x => Array(3).fill(0).map(x => faker.number.int({ min: 1, max: 500 })));

        // Hiển thị số trong ô
        const textData = zData.map((row) => row.map((val) => val + ' bác sĩ'));
        setDataConfig({
            data: [
                {
                    z: completionRate,
                    x: xLabels,
                    y: yLabels,
                    type: 'heatmap',
                    xgap: 3,
                    ygap: 3,
                    colorscale: colorScale,
                    text: textData,
                    texttemplate: '%{text}',
                    zsmooth: false,
                    hoverinfo: '',
                    showscale: true,
                    colorbar: {
                        title: 'Tỷ lệ hoàn thành',
                        titleside: 'right',
                    },
                },
            ]
            , layout: {
                title: {
                    text: 'Số bác sĩ (hiện số) với nền màu theo tỷ lệ hoàn thành cập nhật dữ liệu',
                    font: { size: 16 },
                },
                margin: { l: 120, r: 30, t: 60, b: 60 },
                xaxis: {
                    title: 'Cấp hành chính',
                    ticks: '',
                    side: 'top',
                },
                yaxis: {
                    title: 'Tỉnh',
                    autorange: 'reversed',
                },
                annotations: [],
            }
            , config: { responsive: true }
            , useResizeHandler: true
            , style: { width: '100%', height: '100%' }
        })
    }, [])

    return (
        <div className='w-full h-full'>
            <Plot
                {
                ...dataConfig
                }
            />
        </div>

    );
};

export default DoctorHeatmap;