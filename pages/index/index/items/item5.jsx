import { useState, useEffect } from 'react';
import { PROVINCE_NAME } from '../constant';
import { faker } from '@faker-js/faker';
import { Skeleton, Tooltip } from 'antd';
 
const province = PROVINCE_NAME.map(e => e.name);


const dataNumberDoctor = province.map((e, idx) => Array(3).fill(0).map((e, levelIndex) => {
    if (levelIndex === 2) return faker.number.int({ min: 5, max: 10 });// tỉnh
    if (levelIndex === 1) return faker.number.int({ min: 10, max: 20 });// huyện
    if (levelIndex === 0) return faker.number.int({ min: 20, max: 30 });// xã
}
));
const dataCompleteness = province.map((e, idx) => Array(3).fill(0).map(e => faker.number.int({ min: 0, max: 100 })));


function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function interpolateColor(c1, c2, t) {
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * t),
        g: Math.round(c1.g + (c2.g - c1.g) * t),
        b: Math.round(c1.b + (c2.b - c1.b) * t),
    };
}

function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

const gradient = [
    { stop: 0.0, color: '#eff6ff' },
    { stop: 0.2, color: '#dbeafe' },
    { stop: 0.4, color: '#bfdbfe' },
    { stop: 0.6, color: '#60a5fa' },
    { stop: 0.8, color: '#2563eb' },
    { stop: 1.0, color: '#1e3a8a' },
];

function getColor(value) {
    const min = 0;
    const max = 100;
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));

   

    for (let i = 0; i < gradient.length - 1; i++) {
        const a = gradient[i];
        const b = gradient[i + 1];
        if (ratio >= a.stop && ratio <= b.stop) {
            const t = (ratio - a.stop) / (b.stop - a.stop);
            const interpolated = interpolateColor(hexToRgb(a.color), hexToRgb(b.color), t);
            const bgColor = rgbToHex(interpolated);
            const textColor = interpolated.r * 0.299 + interpolated.g * 0.587 + interpolated.b * 0.114 > 186
                ? '#000000'
                : '#ffffff';
            return {
                backgroundColor: bgColor,
                color: textColor,
            };
        }
    }

    return {
        backgroundColor: '#f3f4f6',
        color: '#000000',
    };
}

export default function DoctorHeatmapTable() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);

        }, faker.number.int({ min: 1000, max: 3000 }));
    }, [])
    return (
        !loaded ? <Skeleton active /> : <div className=''>
            <p className='text-xl font-bold' >{`5. Số lượt khám bệnh`}</p>
            <div className={'mt-1 mb-3 w-[200px]'}>
                <p className="whitespace-nowrap italic ">*Nguồn số liệu: Cơ sơ y tế báo cáo theo Thông tư 37</p>
                {/* <Skeleton.Input active block={true} title={false} size={'small'} rows={1} /> */}
            </div>
            {/* <div className={'mt-1 mb-3 w-[200px]'}>
                <Skeleton.Input active block={true} title={false} size={'small'} rows={1} />
            </div> */}
            <div className={"flex h-full flex-row gap-4"}>
                <div className="flex items-start h-[500px] w-[80%] overflow-auto gap-6">
                    <table className="sticky-table  p-0 border-red-500">
                        <thead>
                            <tr>
                                <th className="bg-white w-[150px] left-0 px-2 py-1"></th>
                                <th className="bg-white text-center px-2 py-1 w-32">Tuyến tỉnh</th>
                                <th className="bg-white text-center px-2 py-1 w-32">Tuyến huyện</th>
                                <th className="bg-white text-center px-2 py-1 w-32">Tuyến xã</th>
                            </tr>
                        </thead>
                        <tbody>
                            {province.map((prov, i) => (
                                <tr key={prov}>
                                    <td className="!text-left font-bold bg-white px-2 ">{prov}</td>
                                    {dataNumberDoctor[i].map((val, j) => {
                                        let percentageColor = dataCompleteness[i][j];
                                        return <td key={j}
                                            style={getColor(percentageColor)}
                                        >
                                            <div className='flex flex-col gap-2'>
                                                <Tooltip
                                                    title={<p className='!text-[0.6rem]'>{`Phần trăm hoàn thành: ${percentageColor}%`}</p>}
                                                >
                                                    <span>{val}</span>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    }
                                    )
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Legend */}

                </div>
                <div
                    className="relative w-4 h-[500px] rounded"
                    style={{
                        background: `linear-gradient(to top, ${gradient.map(e=>e.color).join(', ')}`, // đỏ đậm → nhạt
                    }}
                >
                    <div className="w-4 rounded h-full">
                        <div className="absolute top-0 left-6 text-sm">   0</div>
                        <div className="absolute top-1/4 left-6 text-sm"> 25</div>
                        <div className="absolute top-1/2 left-6 text-sm"> 50</div>
                        <div className="absolute top-3/4 left-6 text-sm"> 75</div>
                        <div className="absolute bottom-0 left-6 text-sm">100</div>
                    </div>
                    <div className="absolute top-1/2 left-1 text-sm -rotate-90 " >
                        <p className='whitespace-nowrap spacing text-sm tracking-[0.02rem]'>Tỉ lệ hoàn thành</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
