import _ from 'lodash'
import { startOfMonth, endOfMonth, parse, format } from 'date-fns'

const { isNumber, trim, chain, groupBy, toNumber } = _

export function isNumeric(str) {
    if (typeof str != "string") {
        return isNumber(str)
    } // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
    );
}

export function getRangeDayInMonth({ isoDhis2 }) {
    const parseFromStr = parse(isoDhis2, 'yyyyMM', new Date());
    const firstInMonth = startOfMonth(parseFromStr);
    const lastDayInMonth = endOfMonth(parseFromStr);

    // console.log(
    //     {
    //         firstInMonth: format(firstInMonth, 'yyyy-MM-dd')
    //         , lastDayInMonth: format(lastDayInMonth, 'yyyy-MM-dd')
    //     })
    return {
        startAt: format(firstInMonth, 'yyyy-MM-dd')
        , endAt: format(lastDayInMonth, 'yyyy-MM-dd')
    }

}

class CompareString {
    ORG_PREFIX = {
        commune_phuong: [
            { from: '^phuong\\s', to: '' },
            { from: '^p\\.\\s', to: '' },
            { from: '^p\\s', to: '' },
        ],
        commune_thiTran: [
            { from: `^Thị trấn\\s`, to: `` },
            { from: `^thi tran\\s`, to: `` },
            { from: `^tt\\.\\s`, to: `` },
            { from: `^tt\\s`, to: `` },
        ],
        commune_xa: [
            { from: '^tram y te xa\\s', to: '' },
            { from: '^tram y te\\s', to: '' },
            { from: '^xa\\s', to: '' },
        ],
        district_quan: [
            { from: '^q\\.', to: '' },
            { from: '^quận\\s', to: '' },
        ],
        district_huyen: [
            { from: '^huyen\\s', to: '' },
            { from: '^huyện\\s', to: '' },
            { from: '^h\\s', to: '' },
            { from: '^h\\.\\s', to: '' },
        ],
        district_thiXa: [
            { from: '^tx\\.\\s', to: '' },
            { from: '^tx\\s', to: '' },
            { from: '^thi xa\\s', to: '' },
        ],
        province: [
            { from: '^tỉnh\\s', to: '' },//Tỉnh
            { from: '^t\\s', to: '' },//Tỉnh
            { from: '^t\\.\\s', to: '' },//Tỉnh
        ],


        thanhPho: [
            { from: '^thanh pho\\s', to: '' },
            { from: '^tp\\.\\s', to: '' },
            { from: '^tp\\s', to: '' },
        ],

        benhVienDaKhoa: [
            { from: '^benh vien da khoa\\s', to: '' },
            { from: '^bvdk\\.\\s', to: '' },
            { from: '^bvdk\\s', to: '' },
        ],
        benhVien: [
            { from: '^benh vien\\s', to: '' },
            { from: '^bv\\.\\s', to: '' },
            { from: '^bv\\s', to: '' },
        ],
    }

    ORG_NAME = [
        // { from: '\\sI\\s', to: '\\s1\\s' },
        // { from: '\\sII\\s', to: '\\s2\\s' },
        // { from: '\\sIII\\s', to: '\\s3\\s' },
        // { from: '\\sIV\\s', to: '\\s4\\s' },
        // { from: '\\sV\\s', to: '\\s5\\s' },
        // { from: '\\sVI\\s', to: '\\s6\\s' },
        // { from: '\\sVII\\s', to: '\\s7\\s' },
        // { from: '\\sVIII\\s', to: '\\s8\\s' },
        // { from: '\\sIX\\s', to: '\\s9\\s' },
        // { from: '\\sX\\s', to: '\\s1\\s0' },


        { from: 'dau day', to: 'dau giay' },//quận.
        { from: 'brvt', to: 'ba ria - vung tau' },//quận.
        { from: 'br-vt', to: 'ba ria - vung tau' },//quận.
        { from: 'Ngũ.H.Sơn', to: 'ngu hanh son' },//
        { from: 'Phan Rang Tháp Chàm', to: 'Phan Rang-Tháp Chàm' },//
        { from: 'Krông A Na', to: 'Krông ANa' },//
        { from: `Ea H'leo`, to: `Ea H' Leo` },//
        { from: `KBang`, to: `K Bang` },//
        { from: `Ia H'Drai`, to: `Ia H’Drai` },//

        { from: `Phăng Sô Lin`, to: `Phăng Xô Lin` },//
        { from: `Sà Dề Phìn`, to: `Xà Dề Phìn` },//
        { from: `Pu Sam Cáp`, to: `Pu Xam Cáp` },//
        { from: `Tủa Sín Chải`, to: `Tủa Xín Chải` },//
        { from: `Hua Bun`, to: `Hua Bum` },//
        { from: `Kan Hồ`, to: `Can Hồ` },//
        { from: `Huổi Lếnh`, to: `Huổi Lếch` },//
        { from: `Xá Tổng`, to: `Sá Tổng` },//
        { from: `Xín Chải`, to: `Sín Chải` },//
        { from: `Sáng Nhè`, to: `Xá Nhè` },//
        { from: "Krông Puk", to: `krong buk` },//
    ];

    SPEC_CHAR = [
        { from: '-', to: ' ' },

        { from: '\\(', to: '' },
        { from: '\\)', to: '' },
    ]

    cleanOrg = (str) => {
        let result = chain(str)
            .thru(this.ReplaceCase.toLowerCase)
            .thru(trim)
            .thru(this.ReplaceCase.removeMultiWhiteScape)
            .thru(this.ReplaceCase.removeAccents)
            .thru(trim)
            .thru(this.ReplaceCaseOrg.replaceOrgPrefix)
            .value()
        return result;
    }

    matchOrg = ({ orgA, orgB, skipPrefix = false }) => {
        let cleanOrgA = this.cleanOrg(orgA)
        let cleanOrgB = this.cleanOrg(orgB)
        let isMatch =
            (!skipPrefix && cleanOrgA.prefix && cleanOrgB.prefix
                ? cleanOrgA.prefix == cleanOrgB.prefix
                : true
            )

            && cleanOrgA.output == cleanOrgB.output

        let result = { cleanOrgA, cleanOrgB, isMatch, skipPrefix }
        return result
    }

    ReplaceCaseOrg = {
        replaceOrgPrefix: (input) => {
            let prefix, output = input;
            Object.entries(this.ORG_PREFIX).some(([groupName, listRegex]) => {
                return listRegex.some(pattern => {
                    let convertFrom = chain(pattern.from)
                        .thru(this.ReplaceCase.toLowerCase)
                        .thru(trim)
                        .thru(this.ReplaceCase.removeMultiWhiteScape)
                        .thru(this.ReplaceCase.removeAccents)
                        .value();
                    let regex = new RegExp(convertFrom, 'g');
                    let isMatch = input.match(regex);
                    if (isMatch) {
                        prefix = groupName;
                        output =
                            chain(input.replace(regex, pattern.to))
                                .thru(this.ReplaceCase.removeMultiWhiteScape)
                                .thru(this.ReplaceCase.trim)
                                .thru(this.ReplaceCaseOrg.replaceOrgName)
                                .thru(val => {
                                    let tryParse = parseInt(val) || val;
                                    return tryParse
                                })
                                .value()
                        return true;
                    }

                })
            })
            return { input, prefix, output }
        },
        replaceOrgName: (input) => {
            let output = input;
            this.ORG_NAME.some(pattern => {
                let convertFrom = chain(pattern.from)
                    .thru(this.ReplaceCase.toLowerCase)
                    .thru(trim)
                    .thru(this.ReplaceCase.removeMultiWhiteScape)
                    .thru(this.ReplaceCase.removeAccents)
                    .value();
                let regex = new RegExp(convertFrom, 'g');
                let isMatch = input.match(regex);
                if (isMatch) {
                    output = input.replace(regex,
                        chain(pattern.to)
                            .thru(this.ReplaceCase.toLowerCase)
                            .thru(trim)
                            .thru(this.ReplaceCase.removeMultiWhiteScape)
                            .thru(this.ReplaceCase.removeAccents).value()
                    );
                    return true;
                }
            })
            return output
        },
    }

    ReplaceCase = {
        toLowerCase: (str) => { return str.toLowerCase() },
        removeMultiWhiteScape: (str) => {
            let re = new RegExp(/\s{2,10}/, 'g');
            str = str.replace(re, " ");
            return str;
        },
        removeAccents: (str) => {
            var AccentsMap = [
                "aàảãáạăằẳẵắặâầẩẫấậ",
                "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
                "dð", "dđ", "DĐ", 'DÐ',
                "eèẻẽéẹêềểễếệ",
                "EÈẺẼÉẸÊỀỂỄẾỆ",
                "iìỉĩíị",
                "IÌỈĨÍỊ",
                "oòỏõóọôồổỗốộơờởỡớợ",
                "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
                "uùủũúụưừửữứự",
                "UÙỦŨÚỤƯỪỬỮỨỰ",
                "yỳỷỹýỵ",
                "YỲỶỸÝỴ"
            ];
            for (var i = 0; i < AccentsMap.length; i++) {
                var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
                var char = AccentsMap[i][0];
                str = str.replace(re, char);
            }
            return str;
        },
        replaceSpecificString: (input) => {
            let output = input;
            output = chain(output).thru(val => {
                this.SPEC_CHAR.forEach(pattern => {
                    let regex = new RegExp(pattern.from, 'g');
                    let isMatch = input.match(regex);
                    if (isMatch) {
                        val = input.replace(regex, ' ');
                    }
                })
                return val
            })
                .thru(this.ReplaceCase.removeMultiWhiteScape)
                .thru(trim)
                .value();

            return output
        },
        trim: (str) => { return trim(str) },
        removeMultiWhiteScapeLast: (str) => {
            let re = new RegExp(/\s{2,10}/, 'g');
            str = str.replace(re, " ");
            return str;
        },
    }

    matchString = ({ strA, strB }) => {
        strA = this.cleanStr(strA)
        strB = this.cleanStr(strB)
        let isMatch = strA == strB


        return {
            strA, strB,
            isMatch
        }
    }

    cleanStr = (str) => {
        let result = chain(str)
            .thru(this.ReplaceCase.toLowerCase)
            .thru(trim)
            .thru(this.ReplaceCase.removeMultiWhiteScape)
            .thru(this.ReplaceCase.removeAccents)
            .thru(trim)
            .thru(this.ReplaceCase.replaceSpecificString)
            .thru(this.ReplaceCase.removeMultiWhiteScape)
            .thru(this.ReplaceCase.toLowerCase)
            .thru(trim)
            .value()
        return result;
    }
}


export const compareString = new CompareString();


export const numToLocaleString = (str, opts = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
}) => {
    const num = toNumber(str);
    if (isNaN(num)) return '-'
    let rs = num.toLocaleString("en-VI", opts);
    return rs;
}
//Test
// {
//     let a  = new CompareString();
//     let b = a.cleanStr('Tx. Hồng Ngự');
//     console.log(b)
// }
