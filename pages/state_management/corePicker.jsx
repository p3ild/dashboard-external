import { create, createStore } from "zustand";

export const useStorePicker = create((set) => {
    return {
        numberRandom: "react",
        actions: {
            setNumberRandom: (number) => set({ numberRandom: number })
        },
    };
})

export const useCoreMetaState = create((set, get) => (
    {
        firstLoadApp: false,
        instanceTarget: undefined,
        reportTarget: undefined,

        orgPickerConfig: undefined,
        pagination: {
            current: '1',
            total: 10,
            position: ['topCenter', 'bottomCenter'],
        },

        meData: undefined,
        networkUtils: undefined,
        version: undefined,
        language: undefined,

        listReport: [],
        activeFolder: '',
        approvalData: {},
        allowPeriodTypes: [],
        excelOptions: {
            /**
             *Support: 
                excelFileName: '', // Excel file nam
                excelOnlyTable: '' // Only export table and ignore header
             */

        },
        globalOverlay: {
            isOpen: true,
            closeable: false
        },
        corePicker: {

        },
        _get: async (api) => {
            const networkUtils = get().networkUtils;
            if (!networkUtils) return "NetworkUtils is unload";
            return networkUtils._get({ api })
        },
        customRowData: [],
        actions: {
            setPagination: (pagination) => {
                set(state => ({ pagination }));
            },
            setFirstLoadApp: async (bool) => {
                set(state => ({ firstLoadApp: bool }));
            },
            setCustomDataRow: ({ singleRowData, customRowData = [], clear = false }) => {

                set(state => {
                    let newCustomRowData = [
                        ...(clear ? [] : state.customRowData),
                        ...customRowData
                    ];
                    if (singleRowData) newCustomRowData[singleRowData.rowIdx] = {
                        ...newCustomRowData[singleRowData.rowIdx],
                        ...singleRowData
                    };
                    return { customRowData: newCustomRowData }
                });
            },
            setCustomPicker: async (customPicker) => {
                set(state => ({ customPicker }));
            },
            setActiveFolder: async (activeFolder) => {
                set(state => ({ activeFolder }));
            },
            setOrgPickerConfig: async (orgPickerConfig) => {
                set(state => ({ orgPickerConfig }));
            },

            setGlobalOverlay: async (globalOverlay) => {
                // globalOverlay.isOpen = true
                set(state => ({ globalOverlay }));
            },
            setExcelOptions: (excelOptions) => {
                set(state => ({ excelOptions }));
            },
            setInstanceTarget: async (instanceTarget) => { set(state => ({ instanceTarget })); },
            setReportTarget: async (reportTarget) => {
                set(state => ({ reportTarget }));
            },
            setLanguage: async (language) => {
                set(state => ({ language }));
            },

            setVersion: async (version) => {
                set(state => ({ version }));
            },
            setMe: async (me) => {
                set(state => ({ me }));
            },
            setListReport: async (listReport) => {
                set(state => ({ listReport }));
            },
            setNetworkUtils: async (networkUtils) => {
                set(state => ({ networkUtils }));
            },
            setAllowPeriodTypes: (allowPeriodTypes) => {
                set(state => ({ allowPeriodTypes }));
            },
            setApprovalData: async (approvalData) => {

                set(state => {
                    let newObj = {
                        ...state.approvalData,
                        ...approvalData
                    };
                    return {
                        approvalData: newObj
                    }
                })
            },
            setCorePicker: async (corePicker) => {
                set(state => {
                    let newCorePicker = {
                        ...state.corePicker,
                        ...corePicker,
                        rePick: Math.random()
                    };
                    return {
                        // approvalData: {},
                        corePicker: newCorePicker
                    }
                })
            },

        }
    }
))

export const getStateByPath = (path) => {
    return get(useCoreMetaState.getState(), path)
}