import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {eventFieldChange, addRow, deleteRow} from '../../actions/commonActions';
import GeneralInfo from '../../components/forms/debtorRegistration/GeneralInfo';
import Obligations from '../../components/forms/debtorRegistration/Obligations';
import GSZ from '../../components/forms/debtorRegistration/GSZ';
import Security from '../../components/forms/debtorRegistration/Security';
import Documents from '../../components/forms/debtorRegistration/Documents';
import PrimaryPlan from '../../components/forms/debtorRegistration/PrimaryPlan';
import OuterContainer from '../../components/layout/OuterContainer';
import Footer from '../../components/layout/Footer';
import {Tab, Nav, NavItem, Row, Col} from 'react-bootstrap';
import {fromJS} from 'immutable'
import arrow from '../../images/arrow.png';

const menuWidth = 200;
const transitionTime = 200;
const maxWidth = 1800;

@connect(
    (state) => {
        return {
            debtorRegistration: state.debtorRegistration,
            validation: state.validation,
        }
    },
    (dispatch) => {
        return {
            eventFieldChange: bindActionCreators(eventFieldChange('debtorRegistration'), dispatch),
            addRow: bindActionCreators(addRow('debtorRegistration'), dispatch),
            deleteRow: bindActionCreators(deleteRow('debtorRegistration'), dispatch),
        }
    }
)

export default class DebtorRegistration extends React.Component {

    state = {collapsed: false, eventKey: 1};

    headerRender = () => {
        const {debtorRegistration} = this.props;
        return(
            <div className='debtorHeader' style={{marginBottom: 10}}>
                <Row className='clearfix' style={{padding: 10}}>
                    <Col md={8} className='debtorHeader__firstChild'>
                        <div>
                            <span>Должник:</span>
                            <span className='debtorHeader__valueWrapper'>
                                {debtorRegistration.getIn(['data', 'client', 'fullName'])}
                            </span>
                        </div>
                        <Row>
                            <Col xs={4} style={{borderRight: '1px solid'}}>
                                <span>ИНН:</span>
                                <span className='debtorHeader__valueWrapper'>
                                    {debtorRegistration.getIn(['data', 'client', 'inn'])}
                                </span>
                            </Col>
                            <Col xs={4} style={{borderRight: '1px solid'}}>
                                <span>КПП:</span>
                                <span className='debtorHeader__valueWrapper'>
                                    {debtorRegistration.getIn(['data', 'client', 'kpp'])}
                                </span>
                            </Col>
                            <Col xs={4}>
                                <span>ОГРН:</span>
                                <span className='debtorHeader__valueWrapper'>
                                    {debtorRegistration.getIn(['data', 'client', 'ogrn'])}
                                </span>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <div>
                            <span>ГСЗ:</span>
                            <span className='debtorHeader__valueWrapper'>
                                {debtorRegistration.getIn(['data', 'client', 'gszName'])}
                            </span>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };


    onPrev = () => {
        this.setState({eventKey: this.state.eventKey - 1});
    };

    onNext = () => {
        this.setState({eventKey: this.state.eventKey + 1});
    };

    render() {
        const {debtorRegistration, eventFieldChange, addRow, deleteRow, showAlert} = this.props;
        const {collapsed, eventKey} = this.state;
        console.log('######', debtorRegistration.toJS(), '######');

        const dictionaries = debtorRegistration.get('references');
        const readonly = debtorRegistration.getIn(['intermediateState', 'readonly']);

        const data = [
            {
                eventKey: 1,
                title: 'Общие сведения',
                component: (
                    <GeneralInfo
                        data={debtorRegistration.getIn(['data', 'client'])}
                        dictionaries={dictionaries}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                    />
                )
            }, {
                eventKey: 2,
                title: 'ГСЗ',
                component: (
                    <GSZ
                        data={debtorRegistration.getIn(['data', 'gsz'])}
                        dictionaries={dictionaries}
                    />
                )
            }, {
                eventKey: 3,
                title: 'Обязательства',
                component: (
                    <Obligations
                        data={debtorRegistration}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                        showAlert={showAlert}
                    />
                )
            }, {
                eventKey: 4,
                title: 'Обеспечение',
                component: (
                    <Security
                        data={debtorRegistration.getIn(['data', 'client', 'loanContracts'])}
                        gszData={debtorRegistration.getIn(['data', 'gsz', 'gszMembers']) ||
                            debtorRegistration.getIn(['data', 'gszObj', 'gszMembers']) || fromJS([])}
                        dictionaries={dictionaries}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                        addRow={addRow}
                        deleteRow={deleteRow}
                    />
                )
            }, {
                eventKey: 5,
                title: 'Документы',
                component: (
                    <Documents
                        data={debtorRegistration.getIn(['data', 'client', 'clientCards', 0, 'documents'])}
                        dictionaries={dictionaries}
                        eventFieldChange={eventFieldChange}
                        readonly={readonly}
                        addRow={addRow}
                        deleteRow={deleteRow}
                    />
                )
            }, {
                eventKey: 6,
                title: 'Первичные мероприятия',
                BlockWrapperStyle: {border: 'none', marginTop: 10},
                component: (
                    <PrimaryPlan
                        data={debtorRegistration.getIn(['data', 'client', 'clientCards', 0])}
                        dictionaries={dictionaries}
                    />
                )
            }
        ];

        const btns = [
            {visible: eventKey > 1, text: 'Назад', onClick: this.onPrev},
            {visible: eventKey < data.length, text: 'Вперед', onClick: this.onNext},
        ];

        return (
            <OuterContainer
                style={{marginTop: 20}}
                maxWidth={maxWidth}
                taskName={readonly ? 'Карточка должника' : debtorRegistration.getIn(['data', 'NodeName'])}
            >
                {this.headerRender()}
                <Tab.Container id='myTab' activeKey={eventKey} onSelect={(eventKey) => this.setState({eventKey})}>
                    <div style={{position: 'relative'}}>
                        <img
                            src={arrow}
                            style={{position: 'absolute', left: collapsed ? -27 : -24, top: 0, zIndex: 3, cursor: 'pointer', transform: collapsed ? 'none' : 'rotate(180deg)'}}
                            onClick={() => this.setState({collapsed: !collapsed})}
                            alt='Скрыть'
                            width={30}
                        />
                        <div style={{
                            float: 'left',
                            width: collapsed ? 0 :  menuWidth,
                            transform: collapsed ? 'rotateX(90deg) rotateY(90deg)' : 'none',
                            transition: collapsed ? `transform ${transitionTime}ms, width ease-in ${transitionTime}ms ${transitionTime}ms` : `transform ease-in ${transitionTime}ms ${transitionTime}ms, width ${transitionTime}ms`
                        }}>
                            <div style={{marginRight: 20}}>
                                <Nav bsStyle='pills' stacked>
                                    {
                                        data.map(({eventKey, title}, index) => {
                                            return(
                                                <NavItem key={index} eventKey={eventKey}>{title}</NavItem>
                                            );
                                        })
                                    }
                                </Nav>
                            </div>
                        </div>
                        <div style={{
                            float: 'right',
                            width: collapsed ? '100%' : `calc(100% - ${menuWidth}px)`,
                            transition: collapsed ? `width ease-in ${transitionTime}ms ${transitionTime}ms` : `width ${transitionTime}ms`
                        }}>
                            <Tab.Content animation={false} mountOnEnter={true} unmountOnExit={true}>
                                {
                                    data.map(({eventKey, component}, index) => {
                                        return(
                                            <Tab.Pane key={index} eventKey={eventKey}>
                                                {component}
                                            </Tab.Pane>
                                        );
                                    })
                                }
                            </Tab.Content>
                        </div>
                        <div className='clearfix'/>
                    </div>
                </Tab.Container>
                <Footer btns={btns} maxWidth={maxWidth}/>
            </OuterContainer>
        );
    }
}