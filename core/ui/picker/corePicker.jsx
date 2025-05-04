
import Orgpicker from "./orgpicker"
// import Timepicker from "./timepicker"
import { Alert, Button, Divider, Flex, List, notification } from "antd"
import { useShallow } from "zustand/react/shallow"
import { memo, useMemo } from "react"
import GroupPeriodPicker from "./GroupPeriodPicker"
import { format } from "date-fns"
import { useCoreMetaState } from "../../../pages/state_management/corePicker"
import { useTrans } from "../../translation/i18n"

export default memo(() => {
    const orgSelected = useCoreMetaState(useShallow(state => state.corePicker.orgSelected));
    const periodSelected = useCoreMetaState(useShallow(state => state.corePicker.periodSelected));
    const [
        corePicker,
        customPicker,
        setCustomPicker,
        setCorePicker,
        setGlobalOverlay
    ] = useCoreMetaState(useShallow(state => [
        state.corePicker,
        state.customPicker,
        state.actions.setCustomPicker,
        state.actions.setCorePicker,
        state.actions.setGlobalOverlay
    ]))

    const buttonLoad = <Button variant={"solid"} onClick={() => {
        let errors = [];
        if (!orgSelected) {
            errors.push('Chưa chọn đơn vị')
        }
        if (
            !periodSelected?.outputDataDhis2
        ) {
            errors.push('Chưa chọn thời điểm')
        }

        if (periodSelected?.errors) errors = [...errors, ...periodSelected?.errors];

        if (periodSelected?.fromTo) {

            if (!periodSelected?.startDate) errors.push('Vui lòng chọn ngày bắt đầu');
            if (!periodSelected?.endDate) errors.push('Vui lòng chọn ngày kết thúc');
        }

        errors.forEach((e) => {
            notification.error(
                {
                    message: e,
                    placement: "top",
                }
            )
        })
        if (errors.length == 0) {
            setCorePicker({ pickCompleted: Math.random() });
            setGlobalOverlay({ isOpen: false });
        } else {

        }
    }}>{useTrans('common:button.loadReport')}</Button>

    return <div className="relative w-full">

        <div gap={10} className="top-2 w-fit flex flex-row gap-x-4 items-center p-1 ml-5 max-h-[80vh] rounded-md  backdrop-blur-[2px]">
            <Orgpicker required />
            <GroupPeriodPicker />
            {buttonLoad}
            {customPicker && customPicker}

        </div>

        <div className="absolute top-0 right-0 p-2 mt-2 py-1 rounded-md  bg-gray-50/80 backdrop-blur-[2px]">
            <p>Thời điểm cập nhật dữ liệu cuối: {format(new Date(), 'dd-MM-yyyy')}</p>
        </div>

    </div>
}, (pre, next) => {
    return 1 == 1
})