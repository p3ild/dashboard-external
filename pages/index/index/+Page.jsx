export default Page

import { Affix, Button, Input } from 'antd'
import { useData } from '../../../renderer/useData'
import { useEffect, useMemo } from 'react';
import { useCoreMetaState, useStorePicker } from '../../state_management/corePicker';
import { useShallow } from 'zustand/shallow';
import { navigate } from 'vike/client/router';
import CorePicker from '../../../core/ui/picker/corePicker';
import { FaCloudDownloadAlt, FaFontAwesomeLogoFull } from "react-icons/fa";
import Item1 from './items/item1';
import Item2 from './items/item2';
import Item3 from './items/item3';
import Item4 from './items/item4';
import Item5 from './items/item5';
import Item6 from './items/item6';
import Item7 from './items/item7';
import Item8 from './items/item8';
import Item9 from './items/item9';
import Item10 from './items/item10';
// import Item9 from './items/item9';

// import { CorePicker } from './CorePicker';

function Page() {
  const [
    corePicker,
    setCorePicker,
  ] = useCoreMetaState(useShallow(state => (
    [
      state.corePicker,
      state.actions.setCorePicker
    ]
  )));

  const { orgViewData } = useData();
  let [
    firstLoadApp,

  ] = useCoreMetaState(useShallow(state => ([
    state.firstLoadApp
  ])));

  useEffect(() => {
    setCorePicker({
      ...(corePicker || {}),
      orgViewData
    })
  }, [orgViewData])



  return (
    firstLoadApp && <>
      <Affix offsetTop={0}
      >
        <div className="flex items-center  bg-[#2c6693] shadow-sm backdrop-blur-2xl flex-row px-2 gap-x-2">
          <FaCloudDownloadAlt className='text-white text-[50rem] w-[60px] h-[60px]' />
          <p className='font-bold text-2xl text-white whitespace-nowrap'>DASHBOARD THỐNG KÊ Y TẾ</p>
        </div>

        <div className='bg-white p-1'>
          <CorePicker />
        </div>
      </Affix>
      <div className="report-wrap bg-gray-200 p-3 h-full">
        <div className="flex flex-col p-4 bg-white rounded-xl mb-5">
          <p className="font-bold text-xl w-fit inline">Giới thiệu</p>
          <span>Dashboard thống kê y tế cung cấp số liệu sơ bộ về các chỉ tiêu thống kê cơ bản ngành y tế. Số liệu do các cơ sở y tế báo cáo qua phần mềm Thống kê y tế</span>
        </div>
        <div className="grid grid-cols-3 gap-5 lg:xl:grid-cols-3">
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[500px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item1 />
          </CardSummary>

          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "col-span-2 h-[600px]",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item2 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "col-span-1 h-[600px]",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item3 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[500px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item4 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "col-span-1 h-[600px]",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item5 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "col-span-2 h-[600px]",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item6 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[500px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item7 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[600px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item8 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[600px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item9 />
          </CardSummary>
          <CardSummary
            {
            ...{
              cardName: 'Tổng số',
              cardClassName: "h-[600px] col-span-3",
              icon: <FaCloudDownloadAlt />,
            }} >
            <Item10 />
          </CardSummary>



        </div>
      </div>
    </>
  )
}


const CardSummary = ({ cardName, cardClassName, icon, children }) => {
  return <div className={`bg-white hover:shadow-2xl py-5 px-4 rounded-xl w-full text-base overflow-hidden  ${cardClassName}`}>
    {children}
  </div>
}
