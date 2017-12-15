import React from 'react';
import CombinedWrapper from '../../controlWrappers/CombinedWrapper';
import EditableTable from '../../common/EditableTable';
import {Button, Panel} from 'react-bootstrap';
import {fromJS} from 'immutable';

const tdStyle = {minWidth: 140};
const border = '1px solid #e0e0e0';
const path = ['data', 'client', 'loanContracts'];

const sumFilialPath = [
    ['onBalanceLiability', 'balanceLoanDebt'],
    ['onBalanceLiability', 'balanceOutstandDebt'],
    ['onBalanceLiability', 'percentDebt'],
    ['onBalanceLiability', 'outstandPercentDebt'],
    ['onBalanceLiability', 'penalties'],
    ['onBalanceLiability', 'rvps'],
    ['onBalanceLiability', 'rvp'],
    ['outBalanceLiability', 'percent'],
    ['outBalanceLiability', 'penalties'],
];

const ownContractsSchema = fromJS([
    {
        header: 'Наименование РФ',
        type: 'select',
        model: 'ref_24',
        id: 'rfId'
    }, {
        header: '№ кредитного договора',
        type: 'text',
        id: 'loanContractNum',
        style: tdStyle
    }, {
        header: 'Валюта договора',
        type: 'select',
        model: 'ref_23',
        labelKey: 'code',
        id: 'currency',
        style: {minWidth: 100}
    }, {
        header: '№ договора обеспечения',
        type: 'text',
        id: 'contractNumber',
        style: tdStyle
    }, {
        header: 'Вид договора обеспечения',
        type: 'select',
        model: 'ref_21',
        id: 'contractKindID'
    }, {
        header: 'Тип договора обеспечения',
        type: 'select',
        model: 'ref_22',
        id: 'contractTypeId'
    }, {
        header: 'Первоначальная сумма договора обеспечения',
        type: 'mask',
        maskType: 'elevenDigitTwoDecimal',
        id: 'originalAmount',
        style: tdStyle
    },
]);

const GSZContractsSchema = fromJS([
    {
        header: 'Наименование РФ',
        type: 'select',
        model: 'ref_24',
        id: 'rfId'
    }, {
        header: 'Наименование заемщика',
        type: 'text',
        id: 'debtorName'
    }, {
        header: '№ кредитного договора',
        type: 'text',
        id: 'loanContractNum',
        style: tdStyle
    }, {
        header: 'Валюта договора',
        type: 'select',
        model: 'ref_23',
        labelKey: 'code',
        id: 'currency',
        style: {minWidth: 100}
    }, {
        header: '№ договора обеспечения',
        type: 'text',
        id: 'contractNumber',
        style: tdStyle
    }, {
        header: 'Вид договора обеспечения',
        type: 'select',
        model: 'ref_21',
        id: 'contractKindID'
    }, {
        header: 'Тип договора обеспечения',
        type: 'select',
        model: 'ref_22',
        id: 'contractTypeId'
    }, {
        header: 'Первоначальная сумма договора обеспечения',
        type: 'mask',
        maskType: 'elevenDigitTwoDecimal',
        id: 'originalAmount',
        style: tdStyle
    },
]);

export default class Obligations extends React.Component {

    state = {nameRF: 1};

    eventFieldChange = (internalPath, val) => {
        let {eventFieldChange, data} = this.props;
        const lastIndex = internalPath.length - 1;
        if (internalPath[lastIndex] === 'contractNumber') {
            const newArr = [...internalPath.slice(0, -1), 'guarantors'];
            data = data.setIn(internalPath, val);
            let guarantors = data.getIn(newArr).map((item) => item.set('loanContractNum', val));
            data = data.setIn(newArr, guarantors);
        }
        eventFieldChange([], data);
    };

    tableRender = () => {
        return(
            <table className='materialTable'>
                <thead>
                <tr>
                    <th rowSpan={2}>Дата открытия договора</th>
                    <th rowSpan={2}>Плановая дата закрытия</th>
                    <th rowSpan={2} style={{borderRight: border}}>Валюта договора</th>
                    <th colSpan={2} style={{borderRight: border, textAlign: 'center'}}>Основной долг</th>
                    <th colSpan={3} style={{borderRight: border, textAlign: 'center'}}>Проценты</th>
                    <th rowSpan={2}>Штрафы, пени, неустойки (руб.)</th>
                    <th rowSpan={2}>РВПС (руб.)</th>
                    <th rowSpan={2}>РВП (руб.)</th>
                </tr>
                <tr>
                    <th>Остаток ссудной задолженности (руб.)</th>
                    <th style={{borderRight: border}}>Остаток просроченной задолженности (руб.)</th>
                    <th>Задолженность по процентам (руб.)</th>
                    <th>Просроченная задолженность по процентам (руб.)</th>
                    <th>Проценты на внебалансе (руб.)</th>
                </tr>
                </thead>
                <tbody>
                {this.tbodyRender()}
                </tbody>
            </table>
        );
    };

    tbodyRender = () => {
        const {data, eventFieldChange, readonly} = this.props;
        const loanContracts = data.getIn(path);
        if (loanContracts.size === 0) return null;
        const trArr = [];
        let nameRF = loanContracts.getIn([0, 'rfId']);
        const resetData = fromJS({
            onBalanceLiability: {
                balanceLoanDebt: 0,
                balanceOutstandDebt: 0,
                percentDebt: 0,
                outstandPercentDebt: 0,
                penalties: 0,
                rvps: 0,
                rvp: 0
            },
            outBalanceLiability: {
                percent: 0,
                penalties: 0
            }
        });
        let filialSumData = resetData;
        let sumData = filialSumData;
        loanContracts.forEach((item, index) => {
            if (item.get('rfId') !== nameRF) {
                trArr.push(this.sumRowRender({data: filialSumData, key: `filial-${index}`, title: 'Итого по филиалу'}));
                nameRF = item.get('rfId');
                filialSumData = resetData;
                sumFilialPath.forEach((internalItem) => {
                    filialSumData = filialSumData.setIn(internalItem, Number(filialSumData.getIn(internalItem)) + Number(item.getIn(internalItem)));
                    sumData = sumData.setIn(internalItem, Number(sumData.getIn(internalItem)) + Number(item.getIn(internalItem)));
                });
            } else {
                sumFilialPath.forEach((internalItem) => {
                    filialSumData = filialSumData.setIn(internalItem, Number(filialSumData.getIn(internalItem)) + Number(item.getIn(internalItem)));
                    sumData = sumData.setIn(internalItem, Number(sumData.getIn(internalItem)) + Number(item.getIn(internalItem)));
                });
            }
            trArr.push(
                <tr key={index}>
                    <td style={{minWidth: 150}}><CombinedWrapper
                        type='date'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.get('startDate')}
                        path={[...path, index, 'startDate']}
                        readonly={readonly}
                    /></td>
                    <td style={{minWidth: 150}}><CombinedWrapper
                        type='date'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.get('endDate')}
                        path={[...path, index, 'endDate']}
                        readonly={readonly}
                    /></td>
                    <td style={{minWidth: 100}}><CombinedWrapper
                        type='select'
                        hideBlock={true}
                        model={data.getIn(['references', 'ref_23'])}
                        labelKey='code'
                        value={item.get('currency')}
                        readonly={true}
                    /></td>
                    <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'balanceLoanDebt'])}
                        path={[...path, index,'onBalanceLiability', 'balanceLoanDebt']}
                        readonly={readonly}
                    /></td>
                    <td style={tdStyle}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'balanceOutstandDebt'])}
                        path={[...path, index, 'onBalanceLiability', 'balanceOutstandDebt']}
                        readonly={readonly}
                    /></td>
                    <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'percentDebt'])}
                        path={[...path, index, 'onBalanceLiability', 'percentDebt']}
                        readonly={readonly}
                    /></td>
                    <td style={tdStyle}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'outstandPercentDebt'])}
                        path={[...path, index, 'onBalanceLiability', 'outstandPercentDebt']}
                        readonly={readonly}
                    /></td>
                    <td style={tdStyle}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['outBalanceLiability', 'percent'])}
                        path={[...path, index, 'outBalanceLiability', 'percent']}
                        readonly={readonly}
                    /></td>
                    <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'penalties'])}
                        path={[...path, index, 'onBalanceLiability', 'penalties']}
                        readonly={readonly}
                    /></td>
                    <td style={tdStyle}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'rvps'])}
                        path={[...path, index, 'onBalanceLiability', 'rvps']}
                        readonly={readonly}
                    /></td>
                    <td style={tdStyle}><CombinedWrapper
                        type='mask'
                        maskType='elevenDigitTwoDecimal'
                        hideBlock={true}
                        handler={eventFieldChange}
                        value={item.getIn(['onBalanceLiability', 'rvp'])}
                        path={[...path, index, 'onBalanceLiability', 'rvp']}
                        readonly={readonly}
                    /></td>
                </tr>
            );
        });
        trArr.push(this.sumRowRender({data: filialSumData, key: 'lastFilial'}));
        trArr.push(this.sumRowRender({data: sumData, key: 'summary'}));
        return trArr;
    };

    sumRowRender = ({data, key}) => {
        return(
            <tr key={key}>
                <td colSpan={3} style={{borderRight: border}}/>
                <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'balanceLoanDebt'])}
                    readonly={true}
                /></td>
                <td style={tdStyle}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'balanceOutstandDebt'])}
                    readonly={true}
                /></td>
                <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'percentDebt'])}
                    readonly={true}
                /></td>
                <td style={tdStyle}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'outstandPercentDebt'])}
                    readonly={true}
                /></td>
                <td style={tdStyle}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['outBalanceLiability', 'percent'])}
                    readonly={true}
                /></td>
                <td style={{...tdStyle, borderLeft: border}}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'penalties'])}
                    readonly={true}
                /></td>
                <td style={tdStyle}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'rvps'])}
                    readonly={true}
                /></td>
                <td style={tdStyle}><CombinedWrapper
                    type='mask'
                    maskType='elevenDigitTwoDecimal'
                    hideBlock={true}
                    value={data.getIn(['onBalanceLiability', 'rvp'])}
                    readonly={true}
                /></td>
            </tr>
        );
    };

    addRow = () => {
        const {data, showAlert, eventFieldChange} = this.props;
        let loanContracts = data.getIn(path);
        const {nameRF} = this.state;
        if (!nameRF) {
            showAlert('Выберите наименование РФ');
            return null;
        } else {
            const addContractData = fromJS({
                contractNumber: null,
                currency: 1,
                startDate: null,
                endDate: null,
                guarantors: [],
                rfId: nameRF,
                onBalanceLiability: {
                    balanceLoanDebt: 0,
                    balanceOutstandDebt: 0,
                    percentDebt: 0,
                    outstandPercentDebt: 0,
                    penalties: 0,
                    rvps: 0,
                    rvp: 0
                },
                outBalanceLiability: {
                    percent: 0,
                    penalties: 0
                }
            });
            loanContracts = loanContracts.push(addContractData).sort((a, b) => a.get('rfId') - b.get('rfId'));
        }
        eventFieldChange(path, loanContracts);
    };

    getOwnContractData = () => {
        const {data} = this.props;
        const id = data.getIn(['data', 'client', 'id']);
        let loanContracts = data.getIn(path);
        let list = fromJS([]);
        loanContracts.forEach((item) => {
            item.get('guarantors').forEach((internalItem) => {
                if (internalItem.get('clientId') === id) {
                    list = list.push(internalItem);
                }
            })
        });
        return list;
    };

    staticTableRender = () => {
        const {data, readonly} = this.props;
        const loanContracts = data.getIn(path);
        if (loanContracts.size === 0) return null;
        const trArr = [];
        let nameRF = loanContracts.getIn([0, 'rfId']);
        loanContracts.forEach((item, index) => {
            if (item.get('rfId') !== nameRF) {
                trArr.push(
                    <tr key={`filial-${index}`}>
                        <td style={{fontWeight: 'bold'}}>
                            <CombinedWrapper
                                type='text'
                                value='Итого по филиалу'
                                readonly={true}
                                hideBlock={true}
                            />
                        </td>
                        <td/>
                    </tr>
                );
                nameRF = item.get('rfId');
            }
            trArr.push(
                <tr key={index}>
                    <td style={{width: 200, maxWidth: 200}}><CombinedWrapper
                        type='select'
                        hideBlock={true}
                        model={data.getIn(['references', 'ref_24'])}
                        value={item.get('rfId')}
                        readonly={true}
                    /></td>
                    <td style={{width: 140, maxWidth: 140}}><CombinedWrapper
                        type='text'
                        hideBlock={true}
                        handler={this.eventFieldChange}
                        value={item.getIn(['contractNumber'])}
                        path={[...path, index, 'contractNumber']}
                        readonly={readonly}
                    /></td>
                </tr>
            );
        });
        trArr.push(
            <tr key='lastFilialSum'>
                <td style={{fontWeight: 'bold'}}>
                    <CombinedWrapper
                        type='text'
                        value='Итого по филиалу'
                        readonly={true}
                        hideBlock={true}
                    />
                </td>
                <td/>
            </tr>
        );
        trArr.push(
            <tr key='summary'>
                <td style={{fontWeight: 'bold'}}>
                    <CombinedWrapper
                        type='text'
                        value='Итого'
                        readonly={true}
                        hideBlock={true}
                    />
                </td>
                <td/>
            </tr>
        );
        return(
            <table className='materialTable'>
                <thead>
                <tr style={{height: 121}}>
                    <th>Наименование РФ</th>
                    <th>№ кредитного договора</th>
                </tr>
                </thead>
                <tbody>
                {trArr}
                </tbody>
            </table>
        );
    };

    render() {
        const {readonly, data} = this.props;
        const {nameRF} = this.state;
        return (
            <div>
                <Panel
                    header='Кредитные договоры'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <div style={{float: 'left', width: 340}}>
                        {this.staticTableRender()}
                    </div>
                    <div style={{overflow: 'auto', float: 'left', width: data.getIn(['data', 'client', 'loanContracts']).size > 0 ? 'calc(100% - 340px)' : '100%'}}>
                        {this.tableRender()}
                    </div>
                    <div className='clearfix'/>
                    {
                        !readonly &&
                        <div style={{marginTop: 5, position: 'relative', width: 450}}>
                            <CombinedWrapper
                                type='select'
                                title='Выберите наименование РФ'
                                model={data.getIn(['references', 'ref_24'])}
                                value={nameRF}
                                path={'nameRF'}
                                handler={(path, val) => this.setState({[path]: val})}
                                blockStyle={{borderBottom: 'none', marginBottom: 0}}
                            />
                            <Button
                                style={{position: 'absolute', bottom: 6, left: 460}}
                                onClick={this.addRow}
                            >
                                Добавить
                            </Button>
                        </div>
                    }
                </Panel>

                <Panel
                    header='Договоры обеспечения'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <h4>По собственным кредитным договорам</h4>
                    <EditableTable
                        schema={ownContractsSchema}
                        data={this.getOwnContractData()}
                        dictionaries={data.get('references')}
                        readonly={true}
                    />
                    <h4>По кредитным договорам третьих лиц - участников ГСЗ</h4>
                    <EditableTable
                        schema={GSZContractsSchema}
                        data={data.getIn(['data', 'client', 'guarantors'])}
                        dictionaries={data.get('references')}
                        readonly={true}
                    />
                </Panel>
            </div>
        );
    }
}