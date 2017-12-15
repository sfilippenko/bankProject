import React from 'react';
import EditableTable from '../../common/EditableTable';
import {getModelName} from '../../../constants/functions';
import {fromJS} from 'immutable';
import {Panel} from 'react-bootstrap';

const path = ['data', 'client', 'loanContracts'];

export default class Security extends React.Component {

    state = {
        debtorNameRef: this.props.gszData.map((item) => fromJS({
            internalId: item.get('clientId'),
            name: item.get('name'),
            inn: item.get('inn')
        })),
    };

    getClassiferDescArr = (data) => {
        const {dictionaries} = this.props;
        const arr = [];
        data.forEach((item) => {
            const classiferId = item.get('classiferId');
            let exist = false;
            dictionaries.get('ref_27').forEach((item) => {
                if (item.get('internalId') === classiferId) {
                    exist = true;
                    arr.push(item.get('name'));
                }
            });
            if (!exist) arr.push(null);
        });
        return arr;
    };

    getInnArr = (data) => {
        const {debtorNameRef} = this.state;
        const arr = [];
        data.forEach((item) => {
            const clientId = item.get('clientId');
            let exist = false;
            debtorNameRef.forEach((item) => {
                if (item.get('internalId') === clientId) {
                    exist = true;
                    arr.push(item.get('inn'));
                }
            });
            if (!exist) arr.push(null);
        });
        return arr;
    };

    filialRender = () => {
        const {data, addRow, deleteRow, readonly, dictionaries, eventFieldChange} = this.props;
        const {debtorNameRef} = this.state;
        if (data.size === 0) return <h3>Договоров нет</h3>;
        const newDictionaries = dictionaries.set('debtorNameRef', debtorNameRef);
        const filialData = [];
        const panelArr = [];
        let nameRF = data.getIn([0, 'rfId']);
        let addRowData = fromJS({
            classiferId: null,
            clientId: null,
            contractKindID: null,
            contractNumber: null,
            contractTypeId: null,
            currency: 1,
            endDate: null,
            isNextPledge: false,
            lastCheckDate: null,
            loanContractNum: null,
            originalAmount: null,
            originalContractNum: null,
            outBalanceAmount: null,
            pledgeStatusId: null,
            qualityCatId: null,
            rfId: nameRF,
            startDate: null,
        });
        data.forEach((item, index) => {
            const tableData = item.getIn(['guarantors']);
            const contractNumber = item.get('contractNumber');
            const schema = fromJS([
                {
                    header: 'Собственник обеспечения',
                    type: 'select',
                    model: 'debtorNameRef',
                    id: 'clientId',
                    style: {minWidth: 150, width: 250, maxWidth: 250},
                    validate: true
                }, {
                    header: 'ИНН собственника обеспечения',
                    type: 'mask',
                    maskType: 'tenDigit',
                    readonlyField: true,
                    id: 'inn',
                    style: {minWidth: 150, width: 150, maxWidth: 150},
                    valueList: this.getInnArr(tableData)
                }, {
                    header: '№ договора обеспечения',
                    type: 'text',
                    id: 'contractNumber'
                }, {
                    header: 'Дата открытия договора обеспечения',
                    type: 'date',
                    id: 'startDate'
                }, {
                    header: 'Дата закрытия договора обеспечения',
                    type: 'date',
                    id: 'endDate'
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
                    header: 'Тип обеспечения',
                    type: 'select',
                    model: 'ref_27',
                    id: 'classiferId'
                }, {
                    header: 'Первоначальная сумма договора обеспечения (руб.)',
                    type: 'mask',
                    maskType: 'elevenDigitTwoDecimal',
                    id: 'originalAmount'
                }, {
                    header: 'Дата последней проверки',
                    type: 'date',
                    id: 'lastCheckDate'
                }, {
                    header: 'Статус залога',
                    type: 'select',
                    model: 'ref_25',
                    id: 'pledgeStatusId'
                }, {
                    header: 'Остаток на внебалансовом счете (руб.)',
                    type: 'mask',
                    maskType: 'elevenDigitTwoDecimal',
                    id: 'outBalanceAmount'
                }, {
                    header: 'Последующий залог',
                    type: 'check',
                    id: 'isNextPledge'
                }, {
                    header: 'Первоначальный договор залога',
                    type: 'text',
                    id: 'originalContractNum'
                },
            ]);

            addRowData = addRowData.set('rfId', nameRF);
            addRowData = addRowData.set('loanContractNum', contractNumber);

            if (item.get('rfId') !== nameRF) {
                panelArr.push(
                    <Panel
                        key={`Panel-${index}`}
                        header={getModelName(nameRF, dictionaries.get('ref_24'))}
                        defaultExpanded={true}
                        collapsible={true}
                    >
                        {filialData.sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1).map((item) => item.component)}
                    </Panel>
                );
                nameRF = item.get('rfId');
                addRowData = addRowData.set('rfId', nameRF);
                filialData.length = 0;
                filialData.push(
                    {
                        sortOrder: contractNumber,
                        component: (
                            <div key={`filialData-${index}`}>
                                <h4>{`По кредитному договору №${contractNumber}`}</h4>
                                <EditableTable
                                    schema={schema}
                                    data={tableData}
                                    path={[...path, index, 'guarantors']}
                                    eventFieldChange={eventFieldChange}
                                    dictionaries={newDictionaries}
                                    addRow={addRow}
                                    deleteRow={deleteRow}
                                    readonly={readonly}
                                    addRowData={addRowData}
                                    pinned={2}
                                    fixedWidth={410}
                                    theadHeight={90}
                                    thStyle={{height: 90}}
                                />
                            </div>
                        )
                    }
                );
            } else {
                filialData.push(
                    {
                        sortOrder: contractNumber,
                        component: (
                            <div key={`filialData-${index}`}>
                                <h4>{`По кредитному договору №${contractNumber}`}</h4>
                                <EditableTable
                                    schema={schema}
                                    data={tableData}
                                    path={[...path, index, 'guarantors']}
                                    eventFieldChange={eventFieldChange}
                                    dictionaries={newDictionaries}
                                    addRow={addRow}
                                    deleteRow={deleteRow}
                                    readonly={readonly}
                                    addRowData={addRowData}
                                    pinned={2}
                                    fixedWidth={410}
                                    theadHeight={90}
                                    thStyle={{height: 90}}
                                />
                            </div>
                        )
                    }
                );
            }
        });
        panelArr.push(
            <Panel
                key='PanelLast'
                header={getModelName(nameRF, dictionaries.get('ref_24'))}
                defaultExpanded={true}
                collapsible={true}
            >
                {filialData.sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1).map((item) => item.component)}
            </Panel>
        );
        return panelArr
    };

    render() {
        return (
            <div>
                {this.filialRender()}
            </div>
        );
    }
}