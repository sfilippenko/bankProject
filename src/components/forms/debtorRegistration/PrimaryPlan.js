import React from 'react';
import CombinedWrapper from '../../controlWrappers/CombinedWrapper';
import TabWrapper from '../../common/TabWrapper';
import EditableTable from '../../common/EditableTable';
import ModalCustom from '../../common/ModalCustom';
import {getModelName, convertDate} from '../../../constants/functions';
import {Button} from 'react-bootstrap';
import {fromJS} from 'immutable';

const shift = 50;

export default class PrimaryPlan extends React.Component {

    state = {stepIndex: 0, modalShow: false, modalData: null};

    onHideModal = () => this.setState({modalShow: false, modalData: null});

    modalDataRender = (data) => () => {
        const {dictionaries} = this.props;
        if (data && data.size > 0) {
            const fieldArr = [];
            data.forEach((item, index) => {
                let textStyle;
                let valueStyle;
                let model;
                let schema;
                let label = item.get('label');
                let value = item.get('value');
                const type = item.get('type');
                if (type === 'select') {
                    label = JSON.parse(label);
                    model = dictionaries.get(label.ref);
                    label = label.title;
                } else if (type === 'complex') {
                    schema = fromJS(JSON.parse(label)).get('schema');
                    value = fromJS(JSON.parse(value));
                } else if (type === 'file') {
                    value = fromJS(JSON.parse(value));
                } else if (type === 'textarea') {
                    textStyle = {height: 54};
                    valueStyle = textStyle;
                }
                switch (type) {
                    case 'complex': {
                        fieldArr.push(
                            <EditableTable
                                key={index}
                                schema={schema}
                                data={value}
                                dictionaries={dictionaries}
                                readonly={true}
                            />
                        );
                        break;
                    }
                    case 'link': {
                        fieldArr.push(<Button key={index} className='btn-sunYellow'>{label}</Button>);
                        break;
                    }
                    case 'checkDate':
                    case 'dateComplete': break;
                    case 'checkNext': {
                        fieldArr.push(
                            <CombinedWrapper
                                key={index}
                                type='check'
                                value={value}
                                title={label}
                                readonly={true}
                            />
                        );
                        break;
                    }
                    default: {
                        fieldArr.push(
                            <CombinedWrapper
                                key={index}
                                type={type}
                                value={value}
                                title={label}
                                model={model}
                                readonly={true}
                                textStyle={textStyle}
                                valueStyle={valueStyle}
                            />
                        );
                        break;
                    }
                }
            });
            this.setState({modalData: fieldArr});
        }
        this.setState({modalShow: true})
    };

    onChangeStep = (nextStepIndex) => {
        this.setState({stepIndex: nextStepIndex});
    };

    tableRender = (headers, trArr) => {
        return(
            <table className='materialTable materialTable--stripped'>
                <thead>
                <tr>
                    {headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
                </thead>
                <tbody>
                {trArr}
                </tbody>
            </table>
        );
    };

    checkListRender = () => {
        const {data, dictionaries} = this.props;
        const checkListItems = data.getIn(['primaryCheckList', 'checkListItems']);
        if (!checkListItems || checkListItems.size === 0) return <h3>Данных еще нет</h3>;
        const checkListArr = [];
        checkListItems.forEach((checkList, index) => {
            let answerList = checkList.get('answerList');
            if (!answerList) return null;
            const checkListQuestion = checkList.get('question');
            answerList.sort((a, b) => a.get('sortOrder') - b.get('sortOrder')).forEach((answer, i) => {
                const label = answer.get('label');
                let type;
                let model;
                let value;
                let push = true;
                let labelStyle = label === checkListQuestion ? {} : {fontWeight: 'normal', paddingLeft: shift};
                let maskType = 'elevenDigitTwoDecimal';
                switch (answer.get('type')) {
                    case 'text': {
                        type = 'text';
                        value = answer.get('value');
                        break;
                    }
                    case 'mask': {
                        type = 'mask';
                        value = answer.get('value');
                        break;
                    }
                    case 'date': {
                        type = 'date';
                        value = Number(answer.get('value'));
                        break;
                    }
                    case 'file': {
                        type = 'file';
                        value = fromJS(JSON.parse(answer.get('value')));
                        break;
                    }
                    case 'select': {
                        const val = JSON.parse(answer.get('value'));
                        type = 'select';
                        model = dictionaries.get(val.ref);
                        value = val.value;
                        break;
                    }
                    case 'complex': {
                        push = false;
                        checkListArr.push(
                            <div key={`${index}-${i}`} style={{paddingLeft: shift}}>
                                <EditableTable
                                    schema={fromJS(JSON.parse(label))}
                                    data={fromJS(JSON.parse(answer.get('value')))}
                                    readonly={true}
                                    thStyle={{fontWeight: 'normal'}}
                                />
                            </div>
                        );
                        break;
                    }
                    case 'title': {
                        push = false;
                        label && checkListArr.push(
                            <div key={`${index}-${i}`} style={{paddingLeft: shift, margin: '10px 0'}}>{label}</div>
                        );
                        break;
                    }
                }
                if (push) {
                    checkListArr.push(
                        <CombinedWrapper
                            key={`${index}-${i}`}
                            type={type}
                            value={value}
                            title={label}
                            maskType={maskType}
                            model={model}
                            readonly={true}
                            valueStyle={{width: '50%'}}
                            labelStyle={{maxWidth: 'none', width: '50%', ...labelStyle}}
                        />
                    );
                }
            });
        });
        return <div>{checkListArr}</div>;
    };

    getStatus = (item) => {
        if (item.get('exactStartDate') && !item.get('exactCompleteDate')) return 'В работе';
        return item.get('isCompleted') ? 'Завершено' : 'Не выполнено';
    };

    primaryActionPlanRender = () => {
        const {data, dictionaries} = this.props;
        const {modalShow, modalData} = this.state;
        const actionPlanItems = data.getIn(['primaryActionPlanList', 'actionPlanItems']);
        if (!actionPlanItems || actionPlanItems.size === 0) return <h3>Данных еще нет</h3>;
        let trArr = [];
        actionPlanItems.forEach((item, index) => {
            trArr.push(
                <tr key={index} style={{height: 51}}>
                    <td style={{minWidth: 40}}>{index + 1}</td>
                    <td style={{minWidth: 400}}>
                        {getModelName(item.get('refId'), dictionaries.get('ref_19'))}
                    </td>
                    {/*<td>debtor</td>*/}
                    <td>{convertDate(item.get('plannedCompleteDate'))}</td>
                    <td>{convertDate(item.get('exactCompleteDate'))}</td>
                    <td><Button onClick={this.modalDataRender(item.get('taskResultList').sort((a, b) => a.get('sortOrder') - b.get('sortOrder')))}>Посмотреть</Button></td>
                    {/*<td>comment</td>*/}
                    <td style={{minWidth: 110}}>{this.getStatus(item)}</td>
                </tr>
            );
        });
        return(
            <div style={{overflow: 'auto'}}>
                {this.tableRender([
                    '№',
                    'Описание мероприятия',
                    //'Должник',
                    'Срок мероприятия',
                    'Фактическая дата выполнения',
                    'Результат выполнения',
                    //'Комментарий',
                    'Статус выполнения'], trArr)}
                <ModalCustom
                    onHide={this.onHideModal}
                    show={modalShow}
                    data={modalData ? modalData : <h4>Данные еще не получены</h4>}
                />
            </div>
        );
    };

    render() {
        const {stepIndex} = this.state;
        const tabData = [
            {
                title: 'План первичных мероприятий',
                component: this.primaryActionPlanRender()
            }, {
                title: 'Чек-лист первичных мероприятий',
                component: this.checkListRender()
            }
        ];
        return(
            <TabWrapper
                data={tabData}
                stepIndex={stepIndex}
                completed={1}
                onChangeStep={this.onChangeStep}
            />
        );
    }
}