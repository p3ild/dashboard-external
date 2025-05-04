import { Button, Divider, Dropdown, Popover, Select, Space, Tabs } from "antd"
import PeriodPicker from "./periodpicker"
import { useMemo, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useTranslation } from "react-i18next"
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useCoreMetaState } from "../../../pages/state_management/corePicker"
import { useTrans } from "../../translation/i18n"


export default () => {
    const { t } = useTranslation;
    const [tabKey, setTabKey] = useState(0);
    const [
        setCorePicker,
        corePicker,
        allowPeriodTypes,
    ] = useCoreMetaState(useShallow(state => [
        state.actions.setCorePicker,
        state.corePicker,
        state.allowPeriodTypes,
        state.customPicker,
        state.actions.setCustomPicker,
        state.actions.setGlobalOverlay
    ]));

    const onChange = (tabKey) => {
        setTabKey(tabKey);
        setCorePicker({
            periodSelected: corePicker?.dataPeriodByType?.[types[tabKey]]
        });
    }

    let types = allowPeriodTypes.filter(e => e);

    const selectType = useMemo(
        () =>
            <div className="flex flex-row gap-1 items-center">
                <Select
                    key={JSON.stringify({ tabKey, types })}
                    className="min-w-[150px] ml-[-11px]"
                    onClick={(e) => e.stopPropagation()}
                    placeholder={'Kỳ dữ liệu'}
                    // variant='filled'
                    options={
                        types.map((type, index) => {
                            let opts = {
                                value: index,
                                label: useTrans(`common:periodPicker.selectType.${type}`)
                            }
                            return opts
                        })
                    }
                    defaultValue={(() => {
                        return useTrans(`common:periodPicker.selectType.${types[tabKey]}`) || useTrans(`common:periodPicker.selectType.${types[0]}`)
                    })()}
                    onChange={onChange}
                />
                <Divider type={"vertical"} className="!p-0 h-[20px] !border-[1.5px]" />
            </div>
        ,
        [JSON.stringify({
            types,
            tabKey
        })]
    )

    const onChangeOuptutDateSelected = ({ fromTo, start, end, result, type, errors }) => {

        let dataConverted = {
            periodSelected: {
                type,

                startDate: start.outputFormat,
                labelStartDate: start.labelFormat,

                endDate: end?.outputFormat,
                labelEndDate: end?.labelFormat,

                outputDataDhis2: result?.outputFormat || `${start.outputFormat}${end?.outputFormat ? ('...' + end?.outputFormat) : ''}`,
                fromTo,
                errors: [...(result?.errors || []), ...(errors || [])] || undefined,
            },

        };

        dataConverted.dataPeriodByType = corePicker?.dataPeriodByType || [];
        dataConverted.dataPeriodByType[types[tabKey]] = dataConverted.periodSelected;

        setCorePicker(dataConverted);
    }

    const GroupPicker = [
        <div>
            {
                types.map((type, index) => {
                    return <div className={`${index == tabKey ? '' : 'hidden'}`}>
                        <PeriodPicker
                            prefix={selectType}
                            antdOpts={{
                                variant: 'borderless'
                            }}
                            onChange={(props) => {
                                onChangeOuptutDateSelected({
                                    ...props, type
                                })
                            }}
                            periodType={type} required />
                    </div>
                })
            }
        </div>
    ]
    let labelDisplayPopover = [corePicker?.periodSelected?.labelStartDate?.toLowerCase(), corePicker?.periodSelected?.labelEndDate?.toLowerCase()].filter(e => e);
    let labelPopover = 'Chưa chọn';
    if (!labelDisplayPopover.length == 0) {
        labelPopover = labelDisplayPopover?.join(' tới ');
    }
    return <div className="flex flex-col gap-3">
        <Popover
            content={GroupPicker}
            trigger="click"
            placement="bottomLeft"
        >
            <Button>
                <Space>
                    {`Thời điểm: ${labelPopover}`}
                    <DownOutlined />
                </Space>

            </Button>
        </Popover>


    </div>
}