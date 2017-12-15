import React from 'react';
import EditableTable from '../../common/EditableTable';
import {fromJS} from 'immutable';
import {Panel} from 'react-bootstrap';

const schemas = fromJS({
    phones: [
        {
            header: '№ П/п',
            type: 'inc',
        }, {
            header: 'Тип телефона',
            type: 'select',
            model: 'ref_5',
            id: 'phoneType',
        }, {
            header: 'Номер телефона',
            type: 'mask',
            maskType: 'tenDigit',
            id: 'phoneNumber'
        }, {
            header: 'Основной',
            type: 'check',
            id: 'isMain'
        }, {
            header: 'Комментарий',
            type: 'textarea',
            id: 'note'
        }
    ],
    emails: [
        {
            header: '№ П/п',
            type: 'inc',
        }, {
            header: 'Тип электронной почты',
            type: 'select',
            model: 'ref_6',
            id: 'emailType',
        }, {
            header: 'Адрес',
            type: 'text',
            id: 'emailAddress'
        }, {
            header: 'Основной',
            type: 'check',
            id: 'isMain'
        }, {
            header: 'Комментарий',
            type: 'textarea',
            id: 'note'
        }
    ],
    contactPersons: [
        {
            header: '№ П/п',
            type: 'inc',
        }, {
            header: 'ФИО',
            type: 'text',
            id: 'fio'
        }, {
            header: 'Должность',
            type: 'text',
            id: 'post'
        }, {
            header: 'Телефон',
            type: 'mask',
            maskType: 'tenDigit',
            id: 'phone'
        }, {
            header: 'E-mail',
            type: 'text',
            id: 'email'
        }, {
            header: 'Комментарий',
            type: 'textarea',
            id: 'note'
        }
    ]
});

export default class Contacts extends React.PureComponent {

    render() {
        const {data, dictionaries, eventFieldChange, addRow, deleteRow, readonly} = this.props;
        return (
            <div>
                <Panel
                    header='Телефоны'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        dictionaries={dictionaries}
                        schema={schemas.get('phones')}
                        addRow={addRow}
                        deleteRow={deleteRow}
                        data={data.get('phones')}
                        path={['data', 'client', 'contacts', 'phones']}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                    />
                </Panel>

                <Panel
                    header='E-mail'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        dictionaries={dictionaries}
                        schema={schemas.get('emails')}
                        addRow={addRow}
                        deleteRow={deleteRow}
                        data={data.get('emails')}
                        path={['data', 'client', 'contacts', 'emails']}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                    />
                </Panel>

                <Panel
                    header='Контактные лица'
                    defaultExpanded={true}
                    collapsible={true}
                >
                    <EditableTable
                        dictionaries={dictionaries}
                        schema={schemas.get('contactPersons')}
                        addRow={addRow}
                        deleteRow={deleteRow}
                        data={data.get('contactPersons')}
                        path={['data', 'client', 'contacts', 'contactPersons']}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                    />
                </Panel>
            </div>
        );
    }
}
