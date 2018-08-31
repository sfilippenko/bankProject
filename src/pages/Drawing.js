import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {eventFieldChange} from '../actions/commonActions';
import {getFullName, getModelName, getRolesArr} from '../constants/functions';
import constants from '../constants/constants';
import OuterContainer from '../components/layout/OuterContainer';
import Draggable from 'react-draggable';
import CombinedWrapper from '../components/controlWrappers/CombinedWrapper';
import ModalCustom from '../components/common/ModalCustom';
import ImageList from '../components/common/ImageList';
import Footer from '../components/layout/Footer';
import {Row, Col, Button} from 'react-bootstrap';
import {fromJS} from 'immutable';
import {Link} from 'react-router';
import UL from '../images/UL.png'
import FL from '../images/FL.png'
import IP from '../images/IP.jpg'
import favicon from '../images/favicon.jpg'
import defaultImg from '../images/default.jpg'
import html2canvas from 'html2canvas';

const outerContainerMaxWidth = 1400;
const height = 1000;
const canvasBorder = 0;
const canvasHeight = height - 4 * canvasBorder;
const paddingLeft = 20;
const offsetTop = 100;
const headerHeight = 50;
const handleHeight = 18;
const lineWidth = 2;
const drawColor = '#39CCCC';
const lineGap = 14;

const imgResolution = 4 / 3;
const sqrSizeX = 210;
const halfSqrX = sqrSizeX / 2;
const sqrSizeY = 90;
const halfSqrY = sqrSizeY / 2;
const arrowLength = 15;
const arrowAngle = 1.3;
const PI = Math.PI;
const deleteWidth = lineGap / 2 - 1;
const gridSize = 5;
const randomSize = 500;
const focusColor = 'rgb(43, 96, 48)';

const path = ['data', 'gsz', 'clientIdentityList'];
const gszPath = ['data', 'gsz'];

const roleColor = [
    {roleId: constants.pledgerId, color: '#ff4136'},
    {roleId: constants.trustorId, color: '#b10dc9'},
    {roleId: constants.guarantorId, color: '#2ecc40'},
    {roleId: constants.affiliatedWithContractsId, color: '#001f3f'},
    {roleId: constants.affiliatedWithoutContractsId, color: '#01FF70'},
    {roleId: constants.ownersId, color: '#FFDC00'},
    {roleId: constants.topManagersId, color: '#DDDDDD'},
    {roleId: constants.responsiblePersonsId, color: '#AAAAAA'},
    {roleId: constants.beneficiariesId, color: '#0074D9'},
    {roleId: constants.controlPersonIdId, color: '#F012BE'},
];

const clientTypeArr = [
    {client: 'Юридическое лицо', img: UL},
    {client: 'Индивидуальный предприниматель', img: IP},
    {client: 'Физическое лицо', img: FL},
    {client: 'Бенефициар', img: defaultImg},
];

function defineCoord({sin, cos, tg, deltaSin, deltaCos, sign}, coord, direction) {
    let newCoord = [coord[0] + deltaCos, coord[1] + deltaSin];

    let deltaHalfX = halfSqrX;
    let deltaHalfY = halfSqrY;
    let sqrYsqrXRelation;

    if (tg < 0) {
        deltaHalfX = halfSqrX + direction * sign * Math.abs(deltaCos);
        deltaHalfY = halfSqrY - direction * sign * Math.abs(deltaSin);
    } else {
        deltaHalfX = halfSqrX - direction * sign * Math.abs(deltaCos);
        deltaHalfY = halfSqrY + direction * sign * Math.abs(deltaSin);
    }
    sqrYsqrXRelation = deltaHalfY / deltaHalfX;
    if (sin > 0 && Math.abs(tg) <= sqrYsqrXRelation) {
        newCoord[0] = newCoord[0] + direction * deltaHalfX;
        newCoord[1] = newCoord[1] - direction * deltaHalfX * tg;
    } else if (sin < 0 && Math.abs(tg) < sqrYsqrXRelation) {
        newCoord[0] = newCoord[0] - direction * deltaHalfX;
        newCoord[1] = newCoord[1] + direction * deltaHalfX * tg;
    } else if (cos > 0 && Math.abs(tg) >= sqrYsqrXRelation) {
        newCoord[0] = newCoord[0] + direction * deltaHalfY / tg;
        newCoord[1] = newCoord[1] - direction * deltaHalfY;
    } else if (cos < 0 && Math.abs(tg) > sqrYsqrXRelation) {
        newCoord[0] = newCoord[0] - direction * deltaHalfY / tg;
        newCoord[1] = newCoord[1] + direction * deltaHalfY;
    }
    return newCoord;
}

@connect(
    (state) => {
        return {
            drawing: state.drawing,
            locationBeforeTransitions: state.routing.locationBeforeTransitions,
        }
    },
    (dispatch) => {
        return {
            eventFieldChange: bindActionCreators(eventFieldChange('drawing'), dispatch),
        }
    }
)

export default class Drawing extends React.Component {

    state = {modalShow: false};

    onHideModal = () => this.setState({modalShow: false});

    modalDataRender = () => {
        const {modalShow} = this.state;
        const {drawing} = this.props;
        if (!modalShow) return null;
        const imgWidth = 40;
        const tableOffset = 10;
        return(
            <div>
                <p>Изображения, соответствующие типам клиента, следующие:</p>
                <table className='materialTable' style={{marginBottom: tableOffset}}>
                    <tbody>
                    {
                        clientTypeArr.map((item, index) =>
                            <tr key={index}>
                                <td style={{width: imgWidth}}><img src={item.img} width={imgWidth}/></td>
                                <td>{item.client}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                <p>Карточки можно перемещать только при выключенном слое рисования. Для этого наведите курсор на черную полоску карточки,
                зажмите левую кнопку мыши, переместите курсор и отпустите левую кнопку мыши.</p>
                <p>Чтобы сохранить положения карточек, нажмите на кнопку "Сохранить" внизу странице. При повторном открытии страницы
                положения карточек сохранятся.</p>
                <p>Связи между должниками выделены соответствующими цветами:</p>
                <table className='materialTable' style={{marginBottom: tableOffset}}>
                    <tbody>
                    {
                        roleColor.map((item, index) =>
                            <tr key={index}>
                                <td style={{minWidth: 60}}>Цвет {index + 1}</td>
                                <td><div style={{width: 150, height: 5, background: item.color}}/></td>
                                <td>{getModelName(item.roleId, drawing.getIn(['references', 'ref_32']))}</td>
                            </tr>
                        )
                    }
                    <tr>
                        <td>Цвет {roleColor.length + 1}</td>
                        <td><div style={{width: 150, height: 5, background: drawColor}}/></td>
                        <td>Редактируемая связь</td>
                    </tr>
                    </tbody>
                </table>
                <p>Между карточками можно провести свою связь. Для этого перейдите в слой рисования, наведите курсор мыши на карточку,
                зажмите левую кнопку мыши, проведите связь к другой карточке и отпустите левую кнопку мыши.</p>
                <p>Для удаления связи нужно перейти в слой рисования, навести курсор мыши на связь, сделать двойной клик левой кнопкой мыши.
                Удалить можно только редактируемые связи.</p>

            </div>
        )
    };

    onInfoClick = () => {
        this.setState({modalShow: true});
    };

    mapColors = (roleId, focus) => {
        if (focus) return focusColor;
        let color = drawColor;
        roleColor.forEach((item) => {
            if (item.roleId === roleId) {
                color = item.color
            }
        });
        return color;
    };

    getRandomPosition = () => {
        const x = Math.floor((Math.random() * randomSize) / gridSize) * gridSize;
        const y = Math.floor((Math.random() * randomSize) / gridSize) * gridSize;
        return {x, y};
    };

    onStart = (index) => () => {
        let {drawing, eventFieldChange} = this.props;
        const zIndex = drawing.getIn(['intermediateState', 'zIndex']);
        drawing = drawing
            .setIn(['intermediateState', 'zIndex'], zIndex + 1)
            .setIn([...path, index, 'visualProperties', 'zIndex'], zIndex + 1);
        eventFieldChange([], drawing);
    };

    onDrag = (index, id) => (e, {x, y}) => {
        const {drawing} = this.props;
        const deltaX = x - drawing.getIn([...path, index, 'visualProperties', 'position', 'x']);
        const deltaY = y - drawing.getIn([...path, index, 'visualProperties', 'position', 'y']);
        this.drawLines(e, {id, deltaX, deltaY});
    };

    onStop = (index) => (e, {lastX, lastY}) => {
        let {drawing, eventFieldChange} = this.props;
        const readonlyConnectionList = drawing.getIn([...gszPath, 'readonlyConnectionList']);
        const editedConnectionList = drawing.getIn([...gszPath, 'editedConnectionList']);
        drawing = drawing.setIn([...path, index, 'visualProperties', 'position'], fromJS({x: lastX, y: lastY}));
        const mappedConnectionList = this.mapDrawingConnections(readonlyConnectionList, editedConnectionList, drawing.getIn(path));
        drawing = drawing.setIn(['intermediateState', 'mappedConnectionList'], mappedConnectionList);
        eventFieldChange([], drawing)
    };

    onAddSign = () => {
        const {drawing, eventFieldChange} = this.props;
        const signs = drawing.getIn(['signs']).push(fromJS({
            position: this.getRandomPosition(),
            zIndex: this.zIndex + 1
        }));
        this.zIndex += 1;
        eventFieldChange(['signs'], signs);
    };

    dragCardRender = () => {
        const {drawing} = this.props;
        const focusCard = drawing.getIn(['intermediateState', 'focusCard']);
        const ref_32 = drawing.getIn(['references', 'ref_32']);
        return drawing.getIn(path).map((item, index) => {
            const id = item.get('id');
            const clientType = item.get('clientType');
            const rolesArr = getRolesArr(drawing.getIn(['data', 'gsz']), item.get('id'), ref_32);
            let img;
            switch (clientType) {
                case constants.FL: {
                    img = FL;
                    break;
                }
                case constants.UL: {
                    img = UL;
                    break;
                }
                case constants.IP: {
                    img = IP;
                    break;
                }
                case 'impossible': {
                    img = favicon;
                    break;
                }
                default: {
                    img = defaultImg;
                    break;
                }
            }
            const imgHeight = sqrSizeY - handleHeight - 2;
            return(
                <Draggable
                    key={index}
                    handle='.drag-card__handle'
                    position={item.getIn(['visualProperties', 'position']).toJS()}
                    bounds='parent'
                    grid={[gridSize, gridSize]}
                    onStart={this.onStart(index)}
                    onStop={this.onStop(index)}
                    onDrag={this.onDrag(index, id)}
                >
                    <div style={{position: 'absolute', zIndex: item.getIn(['visualProperties', 'zIndex'])}}>
                        <div
                            className='drag-card drag-card--hover'
                            style={{width: sqrSizeX, height: sqrSizeY, boxShadow: focusCard === id ? `0 0 10px ${focusColor}` : 'none'}}
                        >
                            <div className='drag-card__handle' style={{height: handleHeight}}/>
                            <div style={{height: imgHeight}}>
                                <div className='pull-left'>
                                    <img className='drag-card__img' src={img} height={sqrSizeY - handleHeight - 2} width={imgHeight / imgResolution}/>
                                </div>
                                <div className='pull-right drag-card__content' style={{width: sqrSizeX - imgHeight / imgResolution - 10, padding: 2}}>
                                    <div className='drag-card__header'>
                                        <ImageList
                                            id={String(id)}
                                            list={rolesArr}
                                            isTooltip
                                        >
                                            {
                                                item.getIn(['visualProperties', 'roleId']) ? <div>{getFullName(item)}</div> :
                                                <Link
                                                    style={{fontWeight: rolesArr.includes(constants.borrowerId) ? 'bold' : 'normal'}}
                                                    to={`/debtorRegistration?clientId=${item.get('id')}`}
                                                >
                                                    {getFullName(item)}
                                                </Link>
                                            }
                                        </ImageList>
                                    </div>
                                    <Row className='drag-card__row'>
                                        <Col xs={4}>ИНН:</Col>
                                        <Col style={{padding: 0}} xs={8}>{item.getIn(['inn'])}</Col>
                                    </Row>
                                    {
                                        clientType !== 3 && item.getIn(['legalIdentity', 'ogrn']) &&
                                        <Row className='drag-card__row'>
                                            <Col xs={4}>ОГРН:</Col>
                                            <Col style={{padding: 0}} xs={8}>{item.getIn(['legalIdentity', 'ogrn'])}</Col>
                                        </Row>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            )
        });
    };

    titleRender = () => {
        const {drawing} = this.props;
        const mappedConnectionList = drawing.getIn(['intermediateState', 'mappedConnectionList']);
        const arr = [];
        mappedConnectionList && mappedConnectionList.forEach((item) => {
            item.forEach((connection) => {
                const roleId = connection.get('roleId');
                const ref_32 = drawing.getIn(['references', 'ref_32']);
                const id = `${connection.get('fromClientId')}-${connection.get('toClientId')}-${roleId}`;
                arr.push(
                    <input
                        key={id}
                        id={id}
                        defaultValue={getModelName(roleId, ref_32) || connection.get('title')}
                        className='connection-title'
                        style={{position: 'absolute'}}
                        disabled={connection.get('readonly')}
                        onBlur={this.onTitleBlur(connection.get('path'))}
                    />
                )
            });
        });
        return(
            <div>
                {arr}
            </div>
        )
    };

    onTitleBlur = (path) => (e) => {
        const {drawing, eventFieldChange} = this.props;
        const newPath = [...path, 'title'];
        const oldValue = drawing.getIn(newPath);
        const value = e.target.value;
        if (oldValue === null && value === '') return null;
        oldValue !== value && eventFieldChange(newPath, value);
    };

    highLightCard = (e) => {
        let {drawing, eventFieldChange} = this.props;
        const focusCard = drawing.getIn(['intermediateState', 'focusCard']);
        const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
        const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
        let matchList = fromJS([]);
        drawing.getIn(path).forEach((item, index) => {
            const x = item.getIn(['visualProperties', 'position', 'x']);
            const y = item.getIn(['visualProperties', 'position', 'y']);
            if (relativeX < x + sqrSizeX && relativeX > x && relativeY < y + sqrSizeY && relativeY > y) {
                matchList = matchList.push(item.set('index', index));
            }
        });
        if (matchList.size === 0) {
            if (focusCard !== null) {
                drawing = drawing
                    .setIn(['intermediateState', 'focusCard'], null)
                    .setIn(['intermediateState', 'canvasCursor'], 'default');
                eventFieldChange([], drawing);
            }
        } else {
            let maxItem = matchList.get(0);
            matchList.forEach((item, index) => {
                if (index === 0) return null;
                if (item.getIn(['visualProperties', 'zIndex']) > maxItem.getIn(['visualProperties', 'zIndex'])) {
                    maxItem = item;
                }
            });
            const id = maxItem.get('id');
            if (focusCard !== id) {
                drawing = drawing
                    .setIn(['intermediateState', 'focusCard'], id)
                    .setIn(['intermediateState', 'canvasCursor'], 'pointer');
                eventFieldChange([], drawing);
            }
        }
    };

    mapDrawingConnections = (list1 = fromJS([]), list2 = fromJS([]), data, options) => {
        const {drawing} = this.props;
        let connectionList = fromJS([]);
        list1.forEach((item, index) => {
            connectionList = connectionList.push(item.set('path', [...gszPath, 'readonlyConnectionList', index]).set('readonly', true));
        });
        list2.forEach((item, index) => {
            let readonly = false;
            if (item.get('roleId') === constants.beneficiariesId) {
                readonly = true;
            }
            connectionList = connectionList.push(item.set('path', [...gszPath, 'editedConnectionList', index]).set('readonly', readonly));
        });
        let mappedConnectionList = fromJS([]);  //массив массивов
        let indexArr = fromJS([]);
        connectionList.forEach((connection, index, arr) => {
            const fromClientId = connection.get('fromClientId');
            const toClientId = connection.get('toClientId');
            if (!fromClientId || !toClientId) return null;
            if (fromClientId === toClientId) return null;
            let newConnectionList = fromJS([]);
            !indexArr.includes(index) && arr.forEach((connectionAgain, indexAgain) => {
                const fromClientIdAgain = connectionAgain.get('fromClientId');
                const toClientIdAgain = connectionAgain.get('toClientId');
                const roleId = connectionAgain.get('roleId');
                if ((fromClientIdAgain === fromClientId && toClientIdAgain === toClientId) ||
                    (fromClientIdAgain === toClientId && toClientIdAgain === fromClientId)) {
                    let exist = false;
                    newConnectionList.forEach((item) => {
                        if (exist) return null;
                        const fromClientIdItem = item.get('fromClientId');
                        const toClientIdItem = item.get('toClientId');
                        if (fromClientIdAgain === fromClientIdItem && toClientIdAgain === toClientIdItem && item.get('roleId') === roleId) {
                            indexArr = indexArr.push(indexAgain);
                            exist = true;
                        }
                    });
                    if (!exist) {
                        indexArr = indexArr.push(indexAgain);
                        newConnectionList = newConnectionList.push(fromJS({
                            fromClientId: fromClientIdAgain,
                            toClientId: toClientIdAgain,
                            roleId,
                            path: connectionAgain.get('path'),
                            readonly: connectionAgain.get('readonly'),
                            title: connectionAgain.get('title'),
                        }));
                    }
                }
            });
            if (newConnectionList.size > 0) {
                newConnectionList = newConnectionList.sort((a, b) => a.get('fromClientId') - b.get('fromClientId'));
                mappedConnectionList = mappedConnectionList.push(newConnectionList);
            }
        });
        mappedConnectionList = mappedConnectionList.map((list) => {
            const size = list.size;
            let delta;
            let deltaFrom = size % 2 === 0 ? -lineGap * (size / 2 - 0.5) : -lineGap * ((size - 1) / 2);
            let deltaTo = size % 2 === 0 ? lineGap * (size / 2 - 0.5) : lineGap * ((size - 1) / 2);
            return list.map((connection, index) => {
                const fromClientId = connection.get('fromClientId');
                const toClientId = connection.get('toClientId');
                let fromCoord;
                let toCoord;
                (data || drawing.getIn(path)).forEach((item) => {
                    const itemId = item.get('id');
                    const x = item.getIn(['visualProperties', 'position', 'x']);
                    const y = item.getIn(['visualProperties', 'position', 'y']);
                    if (fromClientId === itemId) {
                        if (fromCoord) return null;
                        if (index > 0) {
                            deltaFrom += lineGap;
                            delta = deltaFrom;
                        } else {
                            delta = deltaFrom;
                        }
                        if (options) {
                            const {id, deltaX, deltaY} = options;
                            if (id === itemId) {
                                fromCoord = [x + halfSqrX + deltaX, y + halfSqrY + deltaY];
                            } else {
                                fromCoord = [x + halfSqrX, y + halfSqrY];
                            }
                        } else {
                            fromCoord = [x + halfSqrX, y + halfSqrY];
                        }
                    } else if (toClientId === itemId) {
                        if (toCoord) return null;
                        if (index > 0) {
                            deltaTo -= lineGap;
                            delta = deltaTo;
                        } else {
                            delta = deltaTo;
                        }
                        if (options) {
                            const {id, deltaX, deltaY} = options;
                            if (id === itemId) {
                                toCoord = [x + halfSqrX + deltaX, y + halfSqrY + deltaY];
                            } else {
                                toCoord = [x + halfSqrX, y + halfSqrY];
                            }
                        } else {
                            toCoord = [x + halfSqrX, y + halfSqrY];
                        }
                    }
                });
                if (fromCoord && toCoord) {
                    let deltaCos = 0;
                    let deltaSin = 0;
                    const deltaX = toCoord[0] - fromCoord[0];
                    const deltaY = toCoord[1] - fromCoord[1];
                    const length = Math.sqrt(deltaX**2 + deltaY ** 2);
                    const cos = deltaY / length;
                    const sin = -deltaX / length;
                    const tg = cos / sin;
                    const sign = delta > 0 ? 1 : -1;
                    const angle = (sin > 0 ? Math.acos(cos) : 2 * PI - Math.acos(cos));
                    if (delta !== 0) {
                        deltaCos = delta * cos;
                        deltaSin = delta * sin;
                    }
                    const defineCoordBind = defineCoord.bind(null, {sin, cos, tg, deltaSin, deltaCos, sign});
                    toCoord = defineCoordBind(toCoord, 1);
                    fromCoord = defineCoordBind(fromCoord, -1);
                    return connection
                        .set('fromCoord', fromJS(fromCoord))
                        .set('toCoord', fromJS(toCoord))
                        .set('angle', angle);
                }
                return connection;
            })
        });
        return mappedConnectionList;
    };

    drawLines = (e, options) => {
        const {drawing} = this.props;
        const canvasContext = drawing.getIn(['intermediateState', 'canvasContext']);
        if (!canvasContext) return null;
        const startDraw = drawing.getIn(['intermediateState', 'startDraw']);
        const viewPort = drawing.getIn(['intermediateState', 'viewPort']);
        canvasContext.clearRect(0, 0, viewPort - 2 * (paddingLeft + canvasBorder), canvasHeight);
        const readonlyConnectionList = drawing.getIn([...gszPath, 'readonlyConnectionList']);
        const editedConnectionList = drawing.getIn([...gszPath, 'editedConnectionList']);
        let mappedConnectionList;
        if (options) {
            mappedConnectionList = this.mapDrawingConnections(readonlyConnectionList, editedConnectionList, null, options);
        } else {
            mappedConnectionList = drawing.getIn(['intermediateState', 'mappedConnectionList']);
        }

        mappedConnectionList.forEach((item) => {
            item.forEach((connection) => {
                const fromClientId = connection.get('fromClientId');
                const toClientId = connection.get('toClientId');
                const roleId = connection.get('roleId');
                const fromCoord = connection.get('fromCoord');
                const toCoord = connection.get('toCoord');
                const angle = connection.get('angle');
                const fromX = fromCoord.get(0);
                const fromY = fromCoord.get(1);
                const toX = toCoord.get(0);
                const toY = toCoord.get(1);
                canvasContext.beginPath();
                canvasContext.strokeStyle = this.mapColors(connection.get('roleId'), connection.get('focus'));
                canvasContext.lineWidth = lineWidth;
                canvasContext.moveTo(toX, toY);
                canvasContext.lineTo(fromX, fromY);
                canvasContext.moveTo(toX, toY);
                canvasContext.lineTo(toX + arrowLength * Math.cos(angle - arrowAngle), toY + arrowLength * Math.sin(angle - arrowAngle));
                canvasContext.moveTo(...toCoord);
                canvasContext.lineTo(toX + arrowLength * Math.cos(angle + PI + arrowAngle), toY + arrowLength * Math.sin(angle + PI + arrowAngle));
                canvasContext.stroke();

                const input = document.getElementById(`${fromClientId}-${toClientId}-${roleId}`);
                if (input) {
                    const length = Math.sqrt((toX - fromX)**2 + (toY - fromY)** 2);
                    let newAngle = angle * 360 / 2 / PI + 90;
                    //input.style.textAlign = 'left';
                    input.style.width = length + 'px';
                    input.style.left = fromX + 'px';
                    input.style.bottom = canvasHeight - fromY + 'px';
                    if (newAngle < 270 && newAngle > 90) {
                        //input.style.textAlign = 'right';
                        input.style.left = toX + 'px';
                        input.style.bottom = canvasHeight - toY + 'px';
                        newAngle = newAngle + 180;
                    }
                    input.style.transform = `rotate(${newAngle}deg)`;
                }
            });
        });

        if (startDraw) {
            const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
            const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
            canvasContext.beginPath();
            canvasContext.strokeStyle = drawColor;
            canvasContext.lineWidth = lineWidth;
            canvasContext.moveTo(startDraw.get('x'), startDraw.get('y'));
            canvasContext.lineTo(relativeX, relativeY);
            canvasContext.stroke();
        }
    };

    onCanvasDown = (e) => {
        let {drawing, eventFieldChange} = this.props;
        if (e.target.tagName !== 'CANVAS') return null;
        const focusCard = drawing.getIn(['intermediateState', 'focusCard']);
        if (focusCard === null) return null;
        const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
        const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
        eventFieldChange(['intermediateState', 'startDraw'], fromJS({x: relativeX, y: relativeY, id: focusCard}));
    };

    onCanvasMove = (e) => {
        let {drawing, eventFieldChange} = this.props;
        const drawLayout = drawing.getIn(['intermediateState', 'drawLayout']);
        if (!drawLayout) return null;
        const startDraw = drawing.getIn(['intermediateState', 'startDraw']);
        const focusCard = drawing.getIn(['intermediateState', 'focusCard']);
        const canvasCursor = drawing.getIn(['intermediateState', 'canvasCursor']);
        this.highLightCard(e);
        if (startDraw) {
            this.drawLines(e);
        } else if (!startDraw && !focusCard) {
            const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
            const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
            let exist;
            drawing.getIn(['intermediateState', 'mappedConnectionList']).forEach((item, index) => {
                if (exist) return null;
                item.forEach((connection, i) => {
                    if (connection.get('roleId') || exist) return null;
                    const fromX = connection.getIn(['fromCoord', 0]);
                    const fromY = connection.getIn(['fromCoord', 1]);
                    const toX = connection.getIn(['toCoord', 0]);
                    const toY = connection.getIn(['toCoord', 1]);
                    const A = fromY - toY;
                    const B = toX - fromX;
                    const C = (fromX * toY) - (toX * fromY);
                    const d = Math.abs(A * relativeX + B * relativeY + C) / Math.sqrt(A**2 + B**2);
                    let condition1;
                    let condition2;
                    condition1 = (B > 0 ? relativeX > fromX: relativeX > toX) && (B > 0 ? relativeX < toX : relativeX < fromX);
                    condition2 = (A < 0 ? relativeY > fromY: relativeY > toY) && (A < 0 ? relativeY < toY : relativeY < fromY);
                    if (Math.abs(A) < deleteWidth) {
                        condition2 = true;
                    } else if (Math.abs(B) < deleteWidth) {
                        condition1 = true;
                    }
                    if (d < deleteWidth && condition1 && condition2) {
                        exist = true;
                        if (canvasCursor !== 'pointer') {
                            const internalPath = ['intermediateState', 'mappedConnectionList', index, i];
                            drawing = drawing
                                .setIn(['intermediateState', 'canvasCursor'], 'pointer')
                                .setIn(['intermediateState', 'focusLine'], connection)
                                .setIn(['intermediateState', 'focusLinePath'], internalPath)
                                .setIn(internalPath, connection.set('focus', true));
                            eventFieldChange([], drawing);
                            this.drawLines(e);
                        }
                    }
                });
            });
            if (!exist && canvasCursor === 'pointer') {
                const internalPath = drawing.getIn(['intermediateState', 'focusLinePath']);
                const connection = drawing.getIn(['intermediateState', 'focusLine']);
                drawing = drawing
                    .setIn(['intermediateState', 'canvasCursor'], 'default')
                    .setIn(['intermediateState', 'focusLinePath'], null)
                    .setIn(internalPath, connection.set('focus', false))
                    .setIn(['intermediateState', 'focusLine'], null);
                eventFieldChange([], drawing);
                this.drawLines(e);
            }
        }
    };

    onCanvasUp = (e) => {
        let {drawing, eventFieldChange} = this.props;
        const startDraw = drawing.getIn(['intermediateState', 'startDraw']);
        const focusCard = drawing.getIn(['intermediateState', 'focusCard']);
        if (!startDraw) return null;

        const fromClientId = startDraw.get('id');
        if (focusCard !== null && startDraw.get('id') !== focusCard) {
            const newPath = [...gszPath, 'editedConnectionList'];
            const readonlyConnectionList = drawing.getIn([...gszPath, 'readonlyConnectionList']);
            let editedConnectionList = drawing.getIn(newPath);
            let exist = false;
            editedConnectionList.forEach((item) => {
                if (exist) return null;
                if (item.get('fromClientId') === fromClientId && item.get('toClientId') === focusCard && item.get('roleId') !== constants.beneficiariesId) {
                    exist = true;
                }
            });
            if (!exist) {
                editedConnectionList = editedConnectionList.push(fromJS({fromClientId, toClientId: focusCard, title: null}));
            }
            const mappedConnectionList = this.mapDrawingConnections(readonlyConnectionList, editedConnectionList);
            drawing = drawing
                .setIn(newPath, editedConnectionList)
                .setIn(['intermediateState', 'mappedConnectionList'], mappedConnectionList);
        }
        drawing = drawing.setIn(['intermediateState', 'startDraw'], null);
        eventFieldChange([], drawing);
        this.drawLines(e);
    };

    onCanvasDblClick = (e) => {
        let {drawing, eventFieldChange} = this.props;
        const focusLine = drawing.getIn(['intermediateState', 'focusLine']);
        if (!focusLine) return null;
        const readonlyConnectionList = drawing.getIn([...gszPath, 'readonlyConnectionList']);
        let editedConnectionList = drawing.getIn([...gszPath, 'editedConnectionList']).filter((item) => {
            return !(item.get('fromClientId') === focusLine.get('fromClientId') &&
                item.get('toClientId') === focusLine.get('toClientId') &&
                item.get('roleId') === focusLine.get('roleId'));
        });
        const mappedConnectionList = this.mapDrawingConnections(readonlyConnectionList, editedConnectionList);
        drawing = drawing
            .setIn(['intermediateState', 'focusLine'], null)
            .setIn(['intermediateState', 'canvasCursor'], 'default')
            .setIn([...gszPath, 'editedConnectionList'], editedConnectionList)
            .setIn(['intermediateState', 'mappedConnectionList'], mappedConnectionList);
        eventFieldChange([], drawing);
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        this.drawLines(e);
    };

    setCanvasSize = () => {
        const {eventFieldChange} = this.props;
        const width = document.documentElement.offsetWidth;
        let viewPort = outerContainerMaxWidth;
        if (width < outerContainerMaxWidth) {
            viewPort = width;
            this.viewPortOffset = 0;
        } else {
            this.viewPortOffset = (width - outerContainerMaxWidth) / 2;
        }
        setTimeout(() => this.drawLines());
        eventFieldChange(['intermediateState', 'viewPort'], viewPort);
    };

    onSave = () => {
        return null;
    };

    onPrint = () => {
        const {drawing} = this.props;
        html2canvas(document.getElementById('printWrapper'), {
            backgroundColor: null,
            foreignObjectRendering: true,
            scrollY: 0,
            scrollX: 0,
            y: offsetTop + canvasBorder,
            x: paddingLeft + canvasBorder + this.viewPortOffset + 1,
            width: drawing.getIn(['intermediateState', 'viewPort']) - 2 * (paddingLeft + canvasBorder) - 1,
            height: height + offsetTop - 4 * canvasBorder
        }).then((canvas) => {
            const win = window.open();
            win.document.body.appendChild(canvas);
            win.print();
        });
    };

    componentDidMount() {
        let {drawing, eventFieldChange} = this.props;
        const canvas = ReactDOM.findDOMNode(this).querySelector('canvas');
        const readonlyConnectionList = drawing.getIn([...gszPath, 'readonlyConnectionList']);
        const editedConnectionList = drawing.getIn([...gszPath, 'editedConnectionList']);
        const mappedConnectionList = this.mapDrawingConnections(readonlyConnectionList, editedConnectionList);
        const canvasContext = canvas.getContext('2d');
        drawing = drawing
            .setIn(['intermediateState', 'mappedConnectionList'], mappedConnectionList)
            .setIn(['intermediateState', 'canvasContext'], canvasContext);
        eventFieldChange([], drawing);
        this.setCanvasSize();
        window.addEventListener('resize', this.setCanvasSize);
        window.addEventListener('dblclick', this.onCanvasDblClick);
        window.addEventListener('mousedown', this.onCanvasDown);
        window.addEventListener('mousemove', this.onCanvasMove);
        window.addEventListener('mouseup', this.onCanvasUp);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setCanvasSize);
        window.addEventListener('dblclick', this.onCanvasDblClick);
        window.removeEventListener('mousedown', this.onCanvasDown);
        window.removeEventListener('mousemove', this.onCanvasMove);
        window.removeEventListener('mouseup', this.onCanvasUp);
    }

    render() {
        const {drawing, eventFieldChange} = this.props;
        const {modalShow} = this.state;
        const viewPort = drawing.getIn(['intermediateState', 'viewPort']);
        const drawLayout = drawing.getIn(['intermediateState', 'drawLayout']);
        const canvasCursor = drawing.getIn(['intermediateState', 'canvasCursor']);

        console.log('######', drawing.toJS(), '######');

        const btns = [
            {text: 'Сохранить', className: 'btn-sunYellow', onClick: this.onSave},
            {text: 'Печать', onClick: this.onPrint},
        ];

        return (
            <OuterContainer style={{maxWidth: outerContainerMaxWidth, padding: `0 ${paddingLeft}px`}}>
                <div className='flex-center-wrapper' style={{height: offsetTop - headerHeight}}>
                    <CombinedWrapper
                        type='check'
                        hideBlock
                        text='Слой рисования'
                        value={drawLayout}
                        path={['intermediateState', 'drawLayout']}
                        handler={eventFieldChange}
                    />
                    <Button onClick={this.onInfoClick}>Информация</Button>
                </div>
                <div
                    id='printWrapper'
                    style={{position: 'relative', height: height - 2 * canvasBorder, background: 'white'}}
                >
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: drawLayout ? 1 : 0,
                            left: 0,
                            top: 0,
                            boxSizing: 'border-box',
                            border: `${canvasBorder}px solid black`,
                            height: height - 2 * canvasBorder,
                            width: viewPort - 2 * paddingLeft,
                            cursor: canvasCursor
                        }}
                    >
                        <canvas
                            width={viewPort - 2 * (paddingLeft + canvasBorder)}
                            height={canvasHeight}
                        />
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: drawLayout ? 0 : 1,
                            left: 0,
                            top: 0,
                            boxSizing: 'border-box',
                            height: canvasHeight,
                            width: viewPort - 2 * (paddingLeft + canvasBorder),
                            margin: canvasBorder
                        }}
                    >
                        {this.dragCardRender()}
                        {this.titleRender()}
                    </div>
                </div>
                <Footer btns={btns}/>
                <ModalCustom
                    header='Информация'
                    onHide={this.onHideModal}
                    show={modalShow}
                    data={this.modalDataRender()}
                />
            </OuterContainer>
        );
    }
}