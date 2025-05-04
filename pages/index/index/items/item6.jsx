import React, { useEffect, useState } from 'react';
import { PROVINCE_NAME } from '../constant';
import { faker } from '@faker-js/faker';
import { Skeleton } from 'antd';
import { TiWarning } from "react-icons/ti";

const province = PROVINCE_NAME.map(e => e.name);

const data = province.map((e, idx) => Array(12).fill(0).map(e => faker.number.int({ min: 0, max: 500 })));

export default () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, faker.number.int({ min: 1000, max: 3000 }));
    }, [])
    return (
        !loaded ? <Skeleton active /> :
            <div className='p-2'>
                <p className='text-xl font-bold'>{`6. Bảng chỉ số về hệ thống cơ sở y tế và trang thiết bị`}</p>
                <div className={'mt-1 mb-3 w-[200px]'}>
                    <p className="whitespace-nowrap italic ">*Nguồn số liệu: Số liệu báo cáo nhanh do Sở Y tế cung cấp</p>
                    {/* <Skeleton.Input active block={true} title={false} size={'small'} rows={1} /> */}
                </div>
                <div className="h-[500px] overflow-auto gap-6">
                    <table className="sticky-table table-fixed w-[130vw] border-red-500">
                        <thead>
                            <tr>
                                <th style={{ zIndex: 9 }} className="left-0 w-[120px] bg-white py-1">Tỉnh/thành phố</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[90px] py-1">Tỷ lệ dân số tham gia bảo hiểm y tế (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[100px] py-1">Tỷ lệ xã đạt tiêu chí quốc gia về y tế xã (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[80px] py-1">Tỷ lệ khám chữa bệnh tuyến xã (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[70px] py-1">Tỷ số giới tính khi sinh</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[100px] py-1">Tỷ lệ trẻ dưới 1 tuổi được tiêm chủng đầy đủ các loại vắc xin (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[120px] py-1">Tỷ lệ trẻ em dưới 5 tuổi bị suy dinh dưỡng thể thấp còi (chiều cao/tuổi)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[120px] py-1">Tỷ lệ trẻ em dưới 5 tuổi bị suy dinh dưỡng thể nhẹ cân (cân nặng/tuổi)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[120px] py-1">Số ca hiện nhiễm HIV được phát hiện trên 100.000 dân</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[120px] py-1">Số ca tử vong do HIV/AIDS được báo cáo hàng năm trên 100.000 dân</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[110px] py-1">Tỷ lệ hộ gia đình sử dụng nguồn nước sinh hoạt hợp vệ sinh (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[80px] py-1">Tỷ lệ hộ gia đình có nhà tiêu hợp vệ sinh (%)</th>
                                <th className="bg-white !text-left align-top !z-1 px-2 w-[150px] py-1">Tỷ lệ người lao động có nguy cơ được quản lý và khám phát hiện bệnh nghề nghiệp (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {province.map((prov, i) => (
                                <tr key={prov} className='hover:bg-orange-100'>
                                    <td className="sticky hover:bg-orange-100 font-bold !text-left left-0 z-2 bg-white px-2 ">{prov}</td>
                                    {data[i].map((item, idx) => {
                                        return <td className='px-2 !text-right items-end' key={idx}>
                                            {/* {item} */}
                                            <p className='flex flex-row w-fulll items-center place-self-end gap-x-1 w-fit  '> {item < 50 ? <TiWarning className='text-orange-400' /> : ''}{item}</p>
                                        </td>
                                    })}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Legend */}

                </div>
            </div>


    );
}
