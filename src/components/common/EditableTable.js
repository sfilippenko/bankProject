import React from 'react';
import {Button} from 'react-bootstrap';
import CheckBox from './CheckBox';
import CombinedWrapper from '../controlWrappers/CombinedWrapper';
import {fromJS} from 'immutable';

const defaultStyle = {
    inc: {minWidth: 60},
    text: {minWidth: 200},
    textarea: {minWidth: 200},
    select: {minWidth: 200},
    check: {width: 50},
    mask: {minWidth: 140},
    date: {minWidth: 160},
    file: {minWidth: 200},
};

export default class EditableTable extends React.Component {

    state = {
        checkAll: false,
        checkboxList: (this.props.data || fromJS([])).map(() => false)
    };

    shouldComponentUpdate(nextProps) {
        const {data, schema} = nextProps;
        return data !== this.props.data || schema !== this.props.schema;
    }

    resetAllMainCheckboxes = (fieldPath, val) => {
        let {eventFieldChange, data, path} = this.props;
        const preLastItem = fieldPath[fieldPath.length - 2];
        data.forEach((item, index) => {
            if (item.get('isMain')) {
                data = data.setIn([index, 'isMain'], false);
            }
        });
        data = data.setIn([preLastItem, 'isMain'], val);
        eventFieldChange(path, data);
    };

    getField = (itemSchema, index) => {
        let {data, readonly, dictionaries, eventFieldChange, path} = this.props;
        const type = itemSchema.get('type');

        if (type === 'inc') {
            return index + 1;
        } else {
            const model = itemSchema.get('model');
            const valueList = itemSchema.get('valueList');
            const refId = data.getIn([index, 'refId']);
            const id = itemSchema.get('id');
            readonly = readonly || itemSchema.get('readonlyField') || data.getIn([index, 'isReadonly']);
            return (
                <CombinedWrapper
                    type={model && refId ? 'select' : type}
                    path={readonly ? [] : [...path, index, id]}
                    validate={itemSchema.get('validate')}
                    hideBlock={true}
                    value={(model && refId) ? refId : (valueList ? valueList.get(index) : data.getIn([index, id]))}
                    handler={id === 'isMain' ? this.resetAllMainCheckboxes : eventFieldChange}
                    model={model && dictionaries.get(model)}
                    labelKey={model && itemSchema.get('labelKey')}
                    maskType={itemSchema.get('maskType')}
                    disabled={itemSchema.get('disabled') || readonly}
                    readonly={readonly}
                />
            );
        }
    };

    onCheckAllClick = () => {
        let {checkboxList, checkAll} = this.state;
        const {data} = this.props;
        checkAll = !checkAll;
        checkboxList = checkboxList.map((item, index) => {
            if (checkAll) return !data.getIn([index, 'isReadonly']) && !data.getIn([index, 'cantDelete']);
            else return checkAll;
        });
        this.setState({checkboxList, checkAll});
        this.forceUpdate();
    };

    onCheckClick = (item, index) => () => {
        let {checkboxList} = this.state;
        if (!item.get('isReadonly') && !item.get('cantDelete')) {
            checkboxList = checkboxList.set(index, !checkboxList.get(index));
            this.setState({checkboxList});
            this.forceUpdate();
        }
    };

    theadRender = (internalPinned) => {
        const {readonly, schema, thStyle = {}, changeDisabled, pinned} = this.props;
        const {checkAll} = this.state;
        const thArr = [];
        if (!readonly && !changeDisabled && (!pinned || internalPinned)) thArr.push(
            <th key='checkBox' style={{maxWidth: 30, ...thStyle}}>
                <CheckBox
                    value={checkAll}
                    handler={this.onCheckAllClick}
                />
            </th>
        );

        schema.forEach((item, index) => {
            if (internalPinned && index + 1 > internalPinned) return null;
            if (pinned && !internalPinned && index < pinned) return null;
            if (item.get('array')) {
                for (let i = 0; i < item.get('headers').size; i++) {
                    thArr.push(
                        <th style={thStyle} key={`${index}.${i}`}>
                            {item.getIn(['headers', i])}
                        </th>
                    );
                }
            } else {
                thArr.push(
                    <th style={thStyle} key={index}>
                        {item.get('header')}
                    </th>
                );
            }
        });
        return thArr;
    };

    tbodyRender = (internalPinned) => {
        let {checkboxList} = this.state;
        let {pinned} = this.props;
        const {data, schema, readonly, eventFieldChange, path, extraRow, changeDisabled} = this.props;
        const trArr = [];
        (data || fromJS([])).forEach((item, index) => {
            let tdArr = [];
            if (!readonly && !changeDisabled && (!pinned || internalPinned)) tdArr.push(
                <td key='checkBox'>
                    <CheckBox
                        readonly={item.get('isReadonly') || item.get('cantDelete')}
                        value={checkboxList.get(index)}
                        handler={this.onCheckClick(item, index)}
                    />
                </td>
            );
            schema.forEach((itemSchema, internalIndex) => {
                if (internalPinned && internalIndex + 1 > internalPinned) return null;
                if (pinned && !internalPinned && internalIndex < pinned) return null;
                const newStyle = (itemSchema.get('style') && itemSchema.get('style').toJS()) || defaultStyle[itemSchema.get('type')];
                if (itemSchema.get('array')) {
                    itemSchema.get('headers').forEach((item, i) => {
                        tdArr.push(
                            <td key={i} style={newStyle}>
                                <CombinedWrapper
                                    type={itemSchema.get('type')}
                                    path={readonly ? [] : [...path, index, itemSchema.get('id'), i, 'amount']}
                                    hideBlock={true}
                                    value={data.getIn([index, itemSchema.get('id'), i, 'amount'])}
                                    handler={eventFieldChange}
                                    maskType={itemSchema.get('maskType')}
                                    readonly={readonly || data.getIn([index, 'isReadonly'])}
                                />
                            </td>
                        );
                    });
                } else {
                    tdArr.push(
                        <td key={itemSchema.get('id') + index} style={newStyle}>
                            {this.getField(itemSchema, index)}
                        </td>
                    );
                }
            });
            trArr.push(<tr key={index}>{tdArr}</tr>);
        });
        if (extraRow) trArr.push(extraRow);
        return trArr;
    };

    deleteRow = () => {
        const {deleteRow, path} = this.props;
        let {checkboxList, checkAll} = this.state;
        deleteRow(path, checkboxList);
        checkboxList = checkboxList.filter((item) => !item);
        checkAll = false;
        this.setState({checkboxList, checkAll});
    };

    addRow = () => {
        const {addRow, path, schema, addRowData} = this.props;
        let {checkboxList} = this.state;
        if (addRowData) {
            addRow(path, addRowData);
        } else {
            const obj = {};
            schema.forEach((item) => {
                const key = item.get('id');
                if (key) {
                    obj[key] = null;
                }
            });
            addRow(path, obj);
        }
        checkboxList = checkboxList.push(false);
        this.setState({checkboxList});
    };

    render() {
        const {readonly, changeDisabled, pinned, fixedWidth, theadHeight} = this.props;
        return (
            <div>
                {
                    pinned &&
                    <div style={{float: 'left', backgroundColor: 'white', width: fixedWidth}}>
                        <table className='materialTable'>
                            <thead>
                            <tr style={{height: theadHeight}}>
                                {this.theadRender(pinned)}
                            </tr>
                            </thead>
                            <tbody>
                            {this.tbodyRender(pinned)}
                            </tbody>
                        </table>
                    </div>
                }
                <div style={{float: pinned ? 'left' : 'none', overflow: 'auto', width: fixedWidth ? `calc(100% - ${fixedWidth}px)` : '100%'}}>
                    <table className='materialTable'>
                        <thead>
                        <tr>
                            {this.theadRender()}
                        </tr>
                        </thead>
                        <tbody>
                        {this.tbodyRender()}
                        </tbody>
                    </table>
                </div>
                <div className='clearfix'/>
                {
                    !readonly && !changeDisabled &&
                    <div>
                        <Button style={{marginRight: 5}} onClick={this.addRow}>Добавить</Button>
                        <Button onClick={this.deleteRow}>Удалить</Button>
                    </div>
                }
            </div>
        );
    }
}