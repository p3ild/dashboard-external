import { use, useEffect, useState } from "react"
import { useShallow } from "zustand/shallow";
import { useCoreMetaState } from "../../pages/state_management/corePicker";
import { PERIOD_TYPE } from "../ui/picker/periodpicker";
import { initTranslation } from "../translation/i18n";

export default () => {
    let [
        firstLoadApp,
        setFirstLoadApp, setAllowPeriodTypes
    ] = useCoreMetaState(useShallow(state => ([

        state.firstLoadApp,
        state.actions.setFirstLoadApp,
        state.actions.setAllowPeriodTypes,
    ])));
    let languageLoaded = initTranslation();

    useEffect(() => {
        console.log('usePrepareApp');

        (async () => {
            await setAllowPeriodTypes(
                // import.meta.env.PROD
                //     ? [PERIOD_TYPE.date]
                //     : 
                [
                    PERIOD_TYPE.date,
                    PERIOD_TYPE.date2,
                    PERIOD_TYPE.quarter,
                    PERIOD_TYPE.quarter2,
                    PERIOD_TYPE.week,
                    PERIOD_TYPE.week2,
                    PERIOD_TYPE.sixMonth,
                    PERIOD_TYPE.year,
                    PERIOD_TYPE.year2,
                    PERIOD_TYPE.month2,
                    PERIOD_TYPE.month,
                    PERIOD_TYPE.month2,
                ]);
        })();
        // setFirstLoadApp(true);
    }, []);

    useEffect(() => {
        if (languageLoaded) {
            setFirstLoadApp(true);
        }
    }, [languageLoaded]);

    return {
        firstLoadApp
    }

}