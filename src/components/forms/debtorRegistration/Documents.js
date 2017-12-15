import React from 'react';
import EditableTable from '../../common/EditableTable';
import {fromJS} from 'immutable';
import {Panel} from 'react-bootstrap';

const schema = fromJS([
    {
        header: '№ П/п',
        type: 'inc'
    }, {
        header: 'Тип документа',
        type: 'select',
        model: 'ref_7',
        id: 'docType'
    },
    {
        header: 'Наименование документа',
        type: 'text',
        id: 'docName'
    },
    {
        header: 'Дата загрузки',
        type: 'date',
        id: 'uploadDate',
        readonlyField: true
    },
    {
        header: 'Загрузил',
        type: 'text',
        id: 'uploaded',
        readonlyField: true
    },
    {
        header: 'Файл',
        type: 'file',
        id: 'fileLink'
    }
]);

export default class Documents extends React.Component {

    render() {
        const {data, dictionaries, eventFieldChange, addRow, deleteRow, readonly} = this.props;

        return (
            <Panel>
                <EditableTable
                    dictionaries={dictionaries}
                    schema={schema}
                    addRow={addRow}
                    deleteRow={deleteRow}
                    data={data}
                    path={['data', 'client', 'clientCards', 0, 'documents']}
                    eventFieldChange={eventFieldChange}
                    readonly={readonly}
                />
            </Panel>
        );
    }
}
