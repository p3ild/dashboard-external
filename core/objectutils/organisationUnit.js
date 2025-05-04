import { ORG_GROUP } from "../../instanceConfig/baocao.server.js";


export const ORG_SELECTED_TYPE = {
    "COUNTRY": {
        key: "COUNTRY",
    },

    "PROVINCE": { key: "PROVINCE" },
    "PROVINCE_INDIVIDUAL": { key: "PROVINCE_INDIVIDUAL" },

    "UNDER_MINISTRY": { key: "UNDER_MINISTRY" },
    "UNDER_MINISTRY_INDIVIDUAL": { key: "UNDER_MINISTRY_INDIVIDUAL" },

    "DIRECTLY_UNDER_MINISTRY": { key: "DIRECTLY_UNDER_MINISTRY" },
    "DIRECTLY_UNDER_MINISTRY_INDIVIDUAL": { key: "DIRECTLY_UNDER_MINISTRY_INDIVIDUAL" },

    "DISTRICT": { key: "DISTRICT" },
    "DISTRICT_INDIVIDUAL": { key: "DISTRICT_INDIVIDUAL" },

    "COMMUNE": { key: "COMMUNE" },
}


export const classifyingOrgSelected = (orgApi) => {
    let orgType
    switch (true) {
        case orgApi.level === 1:
            orgType = ORG_SELECTED_TYPE.COUNTRY;
            break;
        // Org is province
        case orgApi.level === 2
            && orgApi.organisationUnitGroups.some(e => e.id === ORG_GROUP.TINH_DVHC):
            orgType = ORG_SELECTED_TYPE.PROVINCE;
            break;
        case orgApi.level === 3
            && orgApi.organisationUnitGroups.some(e => e.id === ORG_GROUP.HUYEN_DVHC):
            orgType = ORG_SELECTED_TYPE.DISTRICT;
            break;

        case orgApi.level === 4
            && orgApi.organisationUnitGroups.some(e => e.id === ORG_GROUP.XA):
            orgType = ORG_SELECTED_TYPE.COMMUNE;
            break;
        default:
            break;
    }
    return orgType
}