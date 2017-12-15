import React from 'react';
import EditableTable from '../../common/EditableTable';
import {Panel} from 'react-bootstrap';
import {fromJS} from 'immutable';

const path = ['data','gsz'];
const schema = fromJS([
    {
        header: 'Наименование РФ',
        type: 'select',
        model: 'ref_24',
        id: 'regionalBranch'
    }, {
        header: 'Наименование',
        type: 'text',
        id: 'name'
    }, {
        header: 'ИНН',
        type: 'text',
        id: 'inn'
    },
]);

export default class GSZ extends React.Component {

    render() {
        const {data, dictionaries} = this.props;
        if (!data) return <h3>Данные не получены</h3>;
        return(
            <div>
                <Panel
                    header='Лица, являющиеся заемщиками Банка'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        schema={schema}
                        path={[...path, 'bankDebtor']}
                        data={data.get('bankDebtor')}
                        dictionaries={dictionaries}
                        readonly={true}
                    />
                </Panel>
                <Panel
                    header='Лица, являющиеся должниками по обязательствам заёмщиков Банка'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        schema={schema}
                        path={[...path, 'debtorBankObl']}
                        data={data.get('debtorBankObl')}
                        dictionaries={dictionaries}
                        readonly={true}
                    />
                </Panel>
                <Panel
                    header='Лица, аффилированные с заёмщиками Банка, имеющие договоры с Банком'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        schema={schema}
                        path={[...path, 'refDebtorContr']}
                        data={data.get('refDebtorContr')}
                        dictionaries={dictionaries}
                        readonly={true}
                    />
                </Panel>
                <Panel
                    header='Лица, аффилированные с заёмщиками Банка, не имеющие договоров с Банком'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        schema={schema}
                        path={[...path, 'refDebtorNoContr']}
                        data={data.get('refDebtorNoContr')}
                        dictionaries={dictionaries}
                        readonly={true}
                    />
                </Panel>
            </div>
        );
    }
}