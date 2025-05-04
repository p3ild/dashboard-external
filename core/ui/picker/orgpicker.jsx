import { Card, Cascader, Flex, Popconfirm, Spin, Tree, TreeSelect } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { useShallow } from "zustand/react/shallow";
import { useCallback, useEffect, useMemo, useState } from "react";
import './orgpicker.css'
import { useCoreMetaState } from "../../../pages/state_management/corePicker";
import _ from "lodash";

let { cloneDeep, flatten } = _

export function useOrgTreeByUser() {
    const [
        orgPickerConfig,
        corePicker,
        setCorePicker,
    ] = useCoreMetaState(useShallow(state => (
        [
            state.orgPickerConfig,
            state.corePicker,
            state.actions.setCorePicker
        ]
    )))

    let [orgTreeData, setOrgTreeData] = useState();
    const generateEachOrgData = ({
        orgTarget,
        ORG_TREE_DEEP
    }) => {
        let { orgGroupVisible, hideLevelNotHaveChild } = orgPickerConfig || {}
        if (orgGroupVisible) {
            let groupInclude = orgGroupVisible.filter(e => !e.includes('!'));
            let groupExclude = orgGroupVisible.filter(e => e.includes('!'));
            let invisibleByOrgGroup =
                orgTarget.organisationUnitGroups.every(x => !groupInclude.includes(x.id)) ||
                orgTarget.organisationUnitGroups.some(x => groupExclude.includes(x.id));
            if (
                orgTarget.level != 1 && invisibleByOrgGroup
            ) {
                return undefined
            }
        }



        orgTarget['title'] = generateOrgTitle(orgTarget)
        orgTarget['label'] = generateOrgTitle(orgTarget)
        orgTarget['value'] = orgTarget.id + '_' + orgTarget.title;
        orgTarget.children = orgTarget?.children?.map(orgChild => generateEachOrgData({ orgTarget: orgChild }))
            .filter(e => e != undefined)
            .sort((a, b) => {
                if (a.displayName < b.displayName) { return -1; }
                if (a.displayName > b.displayName) { return 1; }
                return 0;
            });
        if (hideLevelNotHaveChild && hideLevelNotHaveChild?.includes(orgTarget.level) && orgTarget.children.length == 0) {
            return undefined;
        }
        return orgTarget

        function generateOrgTitle(org) {
            let orgTitle = [
                orgTarget.displayName,

                //Include count children
                // orgTarget?.children?.length ? `(${orgTarget?.children?.length})` : ''
            ]

            return orgTitle.join(' ');
        }
    }
    const prepareDataForCustomUI = useCallback(
        () => {
            if (!corePicker?.orgViewData) return
            orgTreeData = cloneDeep(corePicker?.orgViewData)?.map(e => {
                return e?.organisationUnits.map(x => {
                    let orgMapped = generateEachOrgData({
                        orgTarget: x
                    });
                    return orgMapped
                });
            }).filter(e => e != undefined);
            let resultOrgTree = flatten(orgTreeData).filter(e => e);
            if (!resultOrgTree || resultOrgTree.length == 0) {
                setCorePicker({
                    orgSelected: undefined
                })
            }
            // if (overrideOrgTreeDataAfterConverted) orgTreeData = overrideOrgTreeDataAfterConverted({ orgTreeData, me })
            return resultOrgTree
        },
        [corePicker?.orgViewData, orgPickerConfig]
    )
    useEffect(() => {
        if (!corePicker?.orgViewData) return
        (async () => {
            if (corePicker?.orgViewData) {
                let orgTreeDt = prepareDataForCustomUI();
                setOrgTreeData(orgTreeDt);
            }
        })()
    },
        [corePicker?.orgViewData, orgPickerConfig]
    );

    return { orgTreeData, setCorePicker, corePicker }
}

export default (props) => {
    let { required, onSelected } = props
    const { orgTreeData, setCorePicker, onExpandOrgTree, corePicker } = useOrgTreeByUser();
    let [value, setValue] = useState(undefined);
    let [expandedKeys, setTreeExpandedKeys] = useState();
    const CascaderOrg = () => {
        return <Cascader
            className="w-full custom-org-select"
            showSearch
            value={value}
            switcherIcon={<DownOutlined />}
            autoClearSearchValue
            allowClear
            placeholder={'Chọn đơn vị'}
            changeOnSelect
            dropdownHeight={'70vh'}
            defaultValue={
                (expandedKeys || corePicker?.orgSelected)
                    ? corePicker?.orgSelected.path
                    : (
                        orgTreeData[0] ? [
                            `${orgTreeData?.[0]?.id}_${orgTreeData?.[0]?.displayName}`
                        ] : 'Không có đơn vị hỗ trợ xuất báo cáo'
                    )
            }
            treeDefaultExpandedKeys={
                corePicker?.orgSelected ? [
                    `${corePicker?.orgSelected?.id}_${corePicker?.orgSelected?.displayName}`
                ] : []
            }
            onChange={(selectedKeys, info, extra) => {
                let orgTarget = info[info.length - 1];
                setValue(selectedKeys[selectedKeys.length - 1])
                setTreeExpandedKeys(selectedKeys);

                if (onSelected) {
                    // onSelected({ orgTarget, selectedKeys, info, extra })
                } else {
                    setCorePicker({
                        orgSelected: {
                            id: orgTarget?.id,
                            displayName: orgTarget?.displayName,
                            name: orgTarget?.name,
                            code: orgTarget.code,
                            level: orgTarget?.level, path: selectedKeys
                        }
                    })
                }

            }}
            maxTagTextLength={1}
            maxTagCount={1}
            options={orgTreeData}
            // multiple={true}
            displayRender={(label) => {
                return <Flex align={'center'}>
                    {
                        label.map((e, idx) => {
                            if (idx == label.length - 1) {
                                if (e.includes('_')) {
                                    e = e.split('_')[1] + ` (Đơn vị không được hỗ trợ cho báo cáo này. Vui lòng chọn lại đơn vị)`;
                                    setCorePicker({ orgSelected: undefined })
                                }
                                return e
                            }
                            const orgWithID = e?.split('_');
                            return <span key={idx}>{orgWithID.length > 1 ? orgWithID[1] : orgWithID[0]} <span className="text-red-300 font-bold mr-[0.2rem]">{'/'}</span></span>
                        })
                    }
                </Flex>
            }}
            onDropdownVisibleChange={(value) => {
                if (!value) {
                    // setCorePicker({
                    //     orgSelected: {
                    //         id: orgTarget?.id, displayName: orgTarget?.displayName, level: orgTarget?.level, path: selectedKeys
                    //     }
                    // })
                }
            }}
        ></Cascader>
    }



    const TreeSelectMemo = useMemo(
        () => {

            return <Flex vertical gap={10} className={'w-full'}>
                <CascaderOrg />


            </Flex>
        },
        [orgTreeData]
    )
    return <>
        {orgTreeData ?
            <Flex gap={20} align={'center'}  >
                {TreeSelectMemo}
            </Flex> : <Spin />}
    </>
}