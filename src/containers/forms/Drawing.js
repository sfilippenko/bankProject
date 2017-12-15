import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {eventFieldChange} from '../../actions/commonActions';
import OuterContainer from '../../components/layout/OuterContainer';
import Draggable from 'react-draggable';
import CombinedWrapper from '../../components/controlWrappers/CombinedWrapper';
import Footer from '../../components/layout/Footer';
import {Button, Row, Col} from 'react-bootstrap';
import {fromJS} from 'immutable';
import person from '../../images/person.png'
import building from '../../images/building.png'
import html2canvas from 'html2canvas';

const outerContainerMaxWidth = 1400;
const canvasBorder = 1;
const paddingLeft = 20;
const offsetTop = 100;
const dotRadius = 4;
const lineWidth = 3;
const drawColor = '#39CCCC';
const hardColor = 'red';

const height = 1000;
const sqrSizeX = 210;
const sqrSizeY = 90;
const circleSize = 15;
const circleStyle= {
    position: 'absolute',
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    background: 'grey',
};
const deleteWidth = 5;
const deltaArr = [
    {x: 0, y: sqrSizeY / 2},
    {x: sqrSizeX / 2, y: 0},
    {x: sqrSizeX, y: sqrSizeY / 2},
    {x: sqrSizeX / 2, y: sqrSizeY},
];
const gridSize = 5;
const randomSize = 500;

@connect(
    (state) => {
        return {
            drawing: state.drawing,
        }
    },
    (dispatch) => {
        return {
            eventFieldChange: bindActionCreators(eventFieldChange('drawing'), dispatch),
        }
    }
)

export default class Drawing extends React.Component {

    zIndex = 0;
    canvasStart = false;

    state = {
        canvasContext: null,
        viewPort: 1000,
        drawLayout: false,
        focusCircle: null,
        focusLine: fromJS({cursor: 'default', index: null}),
    };

    getRandomPosition = () => {
        const x = Math.floor((Math.random() * randomSize) / gridSize) * gridSize;
        const y = Math.floor((Math.random() * randomSize) / gridSize) * gridSize;
        return {x, y};
    };

    onAddCard = () => {
        const {drawing, eventFieldChange} = this.props;
        const data = drawing.getIn(['data']).push(fromJS({
            id: `randomed-${Math.random().toFixed(6)}`,
            position: this.getRandomPosition(),
            zIndex: this.zIndex + 1
        }));
        this.zIndex += 1;
        eventFieldChange(['data'], data);
    };

    onDeleteCard = (index, id) => () => {
        let {drawing, eventFieldChange} = this.props;
        const data = drawing.getIn(['data']).delete(index);
        const drawConnections = drawing.getIn(['drawConnections']).filter((connection) => connection.getIn(['from', 'id']) !== id && connection.getIn(['to', 'id']) !== id);
        drawing = drawing.setIn(['data'], data).setIn(['drawConnections'], drawConnections);
        eventFieldChange([], drawing);
        setTimeout(() => this.drawLines());
    };

    onStart = (index) => () => {
        const {eventFieldChange} = this.props;
        this.zIndex += 1;
        eventFieldChange(['data', index, 'zIndex'], this.zIndex);
    };

    onDrag = (index, id) => (e, {x, y}) => {
        const {drawing} = this.props;
        const deltaX = x - drawing.getIn(['data', index, 'position', 'x']);
        const deltaY = y - drawing.getIn(['data', index, 'position', 'y']);
        this.drawLines(e, {id, deltaX, deltaY});
    };

    onStop = (index, id) => (e, {lastX, lastY}) => {
        let {drawing, eventFieldChange} = this.props;
        const deltaX = lastX - drawing.getIn(['data', index, 'position', 'x']);
        const deltaY = lastY - drawing.getIn(['data', index, 'position', 'y']);
        const drawConnections = drawing.getIn(['drawConnections']).map((connection) => {
            const fromX = connection.getIn(['from', 'x']);
            const fromY = connection.getIn(['from', 'y']);
            const toX = connection.getIn(['to', 'x']);
            const toY = connection.getIn(['to', 'y']);
            const fromId = connection.getIn(['from', 'id']);
            const toId = connection.getIn(['to', 'id']);
            if (connection.getIn(['from', 'id']) === id) {
                return fromJS({from: {id, x: fromX + deltaX, y:fromY + deltaY}, to: {id: toId, x: toX, y: toY}});
            } else if (connection.getIn(['to', 'id']) === id) {
                return fromJS({from: {id: fromId, x: fromX, y:fromY}, to: {id, x: toX + deltaX, y: toY + deltaY}});
            } else return connection;
        });
        drawing = drawing.setIn(['data', index, 'position'], fromJS({x: lastX, y: lastY}));
        drawing = drawing.setIn(['drawConnections'], drawConnections);
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

    onDeleteSign = (index) => () => {
        const {drawing, eventFieldChange} = this.props;
        const signs = drawing.getIn(['signs']).delete(index);
        eventFieldChange(['signs'], signs);
    };

    onStartSignDrag = (index) => () => {
        const {eventFieldChange} = this.props;
        this.zIndex += 1;
        eventFieldChange(['signs', index, 'zIndex'], this.zIndex);
    };

    onStopSignDrag = (index) => (e, {lastX, lastY}) => {
        let {drawing, eventFieldChange} = this.props;
        drawing = drawing.setIn(['signs', index, 'position'], fromJS({x: lastX, y: lastY}));
        eventFieldChange([], drawing)
    };

    dragCardRender = () => {
        const {focusCircle} = this.state;
        const {drawing} = this.props;
        return drawing.getIn(['data']).map((item, index) => {
            const id = item.get('id');
            let img = person;
            switch (item.get('type')) {
                case 1: {
                    img = person;
                    break;
                }
                case 2: {
                    img = building;
                    break;
                }
            }
            return(
                <Draggable
                    key={index}
                    handle='.drag-card__handle'
                    position={item.get('position').toJS()}
                    bounds='parent'
                    grid={[gridSize, gridSize]}
                    onStart={this.onStart(index)}
                    onStop={this.onStop(index, id)}
                    onDrag={this.onDrag(index, id)}
                >
                    <div style={{position: 'absolute', zIndex: item.get('zIndex')}}>
                        <div
                            className='drag-card'
                            style={{width: sqrSizeX, height: sqrSizeY}}
                        >
                            <div className='drag-card__handle'>
                                <span
                                    className='Select-clear'
                                    style={{color: 'white', fontWeight: 'bold', marginRight: 5, cursor: 'pointer'}}
                                    onClick={this.onDeleteCard(index, id)}
                                >
                                    {'\u00D7'}
                                </span>
                            </div>
                            <div style={{height: sqrSizeY - 20}}>
                                <div className='pull-left'>
                                    <img className='drag-card__img' src={img} height={sqrSizeY - 20}/>
                                </div>
                                <div className='pull-right drag-card__content'>
                                    <div className='drag-card__header'>{item.getIn(['data', 'fullName'])}</div>
                                    <Row className='drag-card__row'>
                                        <Col xs={4}>ИНН:</Col>
                                        <Col className='drag-card__value' xs={8}>{item.getIn(['data', 'inn'])}</Col>
                                    </Row>
                                    {
                                        item.getIn(['data', 'ogrn']) &&
                                        <Row className='drag-card__row'>
                                            <Col xs={4}>ОГРН:</Col>
                                            <Col className='drag-card__value' xs={8}>{item.getIn(['data', 'ogrn'])}</Col>
                                        </Row>
                                    }
                                </div>
                            </div>
                            {
                                deltaArr.map(({x, y}, i) =>
                                    <div key={i} style={{
                                        ...circleStyle,
                                        top: y - circleSize / 2,
                                        left: x- circleSize / 2,
                                        border: focusCircle && focusCircle.get('index') === index &&
                                        focusCircle.get('deltaX') === x &&
                                        focusCircle.get('deltaY') === y ? '3px solid blue' : 'none'
                                    }}/>
                                )
                            }
                        </div>
                    </div>
                </Draggable>
            )
        });
    };

    dragSignRender = () => {
        const {drawing, eventFieldChange} = this.props;
        return drawing.getIn(['signs']).map((item, index) => {
            return(
                <Draggable
                    key={index}
                    handle='.drag-card__handle'
                    position={item.get('position').toJS()}
                    bounds='parent'
                    grid={[gridSize, gridSize]}
                    onStart={this.onStartSignDrag(index)}
                    onStop={this.onStopSignDrag(index)}
                >
                    <div style={{position: 'absolute', width: 70, zIndex: item.get('zIndex')}}>
                        <div className='drag-card__handle' style={{background: '#2b6030'}}>
                            <span
                                className='Select-clear'
                                style={{color: 'white', fontWeight: 'bold', marginRight: 5, cursor: 'pointer'}}
                                onClick={this.onDeleteSign(index)}
                            >
                                {'\u00D7'}
                            </span>
                        </div>
                        <CombinedWrapper
                            type='text'
                            value={item.get('value')}
                            hideBlock={true}
                            placeholder='Надпись...'
                            path={['signs', index, 'value']}
                            handler={eventFieldChange}
                            textStyle={{
                                position: 'relative',
                                bottom: 2,
                                padding: '0 2px',
                                height: 20,
                                lineHeight: '20px',
                                borderColor: '#2b6030',
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderTop: 'none'
                            }}
                        />
                    </div>
                </Draggable>
            )
        });
    };

    highLightCircles = (e) => {
        const {focusCircle} = this.state;
        const {drawing} = this.props;
        const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
        const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
        let exist = false;
        drawing.getIn(['data']).forEach((item, index) => {
            if (!exist) {
                for (let i = 0; i < deltaArr.length; i++) {
                    const x = item.getIn(['position', 'x']) + deltaArr[i].x;
                    const y = item.getIn(['position', 'y']) + deltaArr[i].y;
                    if (Math.sqrt((x - relativeX) ** 2 + (y - relativeY) ** 2) < circleSize / 2) {
                        if (!focusCircle) this.setState({focusCircle: fromJS({index, deltaX: deltaArr[i].x, deltaY: deltaArr[i].y})});
                        exist = true;
                        break;
                    }
                }
            }
            if (!exist && focusCircle && focusCircle.get('index') === index) {
                this.setState({focusCircle: null});
            }
        });
    };

    drawLines = (e, options) => {
        const {canvasContext} = this.state;
        const {drawing} = this.props;
        if (!canvasContext) return null;
        canvasContext.clearRect(0, 0, this.state.viewPort - 2 * (paddingLeft + canvasBorder), height - 4 * canvasBorder);
        const hardConnections = drawing.getIn(['hardConnections']);
        const drawConnections = drawing.getIn(['drawConnections']);
        const data = drawing.getIn(['data']);
        if (hardConnections.size > 0) {
            hardConnections.forEach((connection) => {
                let fromCoord;
                let toCoord;
                data.forEach((item) => {
                    const itemId = item.get('id');
                    if (connection.get('from') === itemId) {
                        if (options) {
                            const {id, deltaX, deltaY} = options;
                            if (id === itemId) {
                                fromCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2 + deltaX, item.getIn(['position', 'y']) + sqrSizeY / 2 + deltaY];
                            } else {
                                fromCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2, item.getIn(['position', 'y']) + sqrSizeY / 2];
                            }
                        } else {
                            fromCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2, item.getIn(['position', 'y']) + sqrSizeY / 2];
                        }
                    } else if (connection.get('to') === itemId) {
                        if (options) {
                            const {id, deltaX, deltaY} = options;
                            if (id === itemId) {
                                toCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2 + deltaX, item.getIn(['position', 'y']) + sqrSizeY / 2 + deltaY];
                            } else {
                                toCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2, item.getIn(['position', 'y']) + sqrSizeY / 2];
                            }
                        } else {
                            toCoord = [item.getIn(['position', 'x']) + sqrSizeX / 2, item.getIn(['position', 'y']) + sqrSizeY / 2];
                        }
                    }
                });
                if (fromCoord && toCoord) {
                    canvasContext.beginPath();
                    canvasContext.strokeStyle = hardColor;
                    canvasContext.fillStyle = hardColor;
                    canvasContext.lineWidth = lineWidth;
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(...toCoord);
                    canvasContext.stroke();
                    canvasContext.moveTo(...toCoord);
                    canvasContext.arc(...toCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                }
            });
        }
        if (options) {
            const {id, deltaX, deltaY} = options;
            drawConnections.forEach((connection) => {
                canvasContext.beginPath();
                canvasContext.strokeStyle = drawColor;
                canvasContext.fillStyle = drawColor;
                canvasContext.lineWidth = lineWidth;
                if (connection.getIn(['from', 'id']) === id) {
                    const fromCoord = [connection.getIn(['from', 'x']) + deltaX, connection.getIn(['from', 'y']) + deltaY];
                    const toCoord = [connection.getIn(['to', 'x']), connection.getIn(['to', 'y'])];
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(...toCoord);
                    canvasContext.stroke();
                    canvasContext.moveTo(...toCoord);
                    canvasContext.arc(...toCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                } else if (connection.getIn(['to', 'id']) === id) {
                    const fromCoord = [connection.getIn(['from', 'x']), connection.getIn(['from', 'y'])];
                    const toCoord = [connection.getIn(['to', 'x']) + deltaX, connection.getIn(['to', 'y']) + deltaY];
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(...toCoord);
                    canvasContext.stroke();
                    canvasContext.moveTo(...toCoord);
                    canvasContext.arc(...toCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                } else {
                    const fromCoord = [connection.getIn(['from', 'x']), connection.getIn(['from', 'y'])];
                    const toCoord = [connection.getIn(['to', 'x']), connection.getIn(['to', 'y'])];
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(...toCoord);
                    canvasContext.stroke();
                    canvasContext.moveTo(...toCoord);
                    canvasContext.arc(...toCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                }
            });
        } else {
            drawConnections.forEach((connection) => {
                canvasContext.beginPath();
                canvasContext.strokeStyle = drawColor;
                canvasContext.fillStyle = drawColor;
                canvasContext.lineWidth = lineWidth;
                const fromCoord = [connection.getIn(['from', 'x']), connection.getIn(['from', 'y'])];
                if (connection.get('to')) {
                    const toCoord = [connection.getIn(['to', 'x']), connection.getIn(['to', 'y'])];
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(...toCoord);
                    canvasContext.stroke();
                    canvasContext.moveTo(...toCoord);
                    canvasContext.arc(...toCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                } else {
                    const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
                    const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
                    canvasContext.arc(...fromCoord, dotRadius, 0, 2*Math.PI);
                    canvasContext.fill();
                    canvasContext.moveTo(...fromCoord);
                    canvasContext.lineTo(relativeX, relativeY);
                    canvasContext.stroke();
                }
            });
        }
    };

    onCanvasDown = (e) => {
        let {focusCircle, canvasContext} = this.state;
        let {drawing, eventFieldChange} = this.props;
        if (e.target.tagName !== 'CANVAS') return null;
        if (!focusCircle) return null;
        this.canvasStart = true;
        const index = focusCircle.get('index');
        const x = drawing.getIn(['data', index, 'position', 'x']) + focusCircle.get('deltaX');
        const y = drawing.getIn(['data', index, 'position', 'y']) + focusCircle.get('deltaY');
        canvasContext.beginPath();
        canvasContext.strokeStyle = drawColor;
        canvasContext.fillStyle = drawColor;
        canvasContext.lineWidth = lineWidth;
        canvasContext.arc(x, y, dotRadius, 0, 2*Math.PI);
        canvasContext.fill();
        const drawConnections = drawing.getIn(['drawConnections']).push(fromJS({from: {id: drawing.getIn(['data', index, 'id']), x, y}}));
        eventFieldChange(['drawConnections'], drawConnections);
    };

    onCanvasMove = (e) => {
        let {drawLayout, focusLine} = this.state;
        const {drawing} = this.props;
        if (drawLayout) this.highLightCircles(e);
        if (!this.canvasStart && drawLayout) {
            const relativeX = e.clientX - (paddingLeft + canvasBorder + this.viewPortOffset);
            const relativeY = e.clientY - (offsetTop + canvasBorder - document.documentElement.scrollTop);
            let exist;
            drawing.getIn(['drawConnections']).forEach((connection, index) => {
                const fromX = connection.getIn(['from', 'x']);
                const fromY = connection.getIn(['from', 'y']);
                const toX = connection.getIn(['to', 'x']);
                const toY = connection.getIn(['to', 'y']);
                const A = fromY - toY;
                const B = toX - fromX;
                const C = (fromX * toY) - (toX * fromY);
                const d = Math.abs(A * relativeX + B * relativeY + C) / Math.sqrt(A**2 + B**2);
                const radius = circleSize / 2;
                const condition1 = Math.sqrt((relativeX - fromX)**2 + (relativeY - fromY)**2) > radius;
                const condition2 = Math.sqrt((relativeX - toX)**2 + (relativeY - toY)**2) > radius;
                if (d < deleteWidth && condition1 && condition2) {
                    exist = true;
                    if (focusLine.get('cursor') !== 'pointer') {
                        focusLine = focusLine.set('cursor', 'pointer');
                        focusLine = focusLine.set('index', index);
                        this.setState({focusLine});
                    }
                }
            });
            if (!exist && focusLine.get('cursor') === 'pointer') {
                focusLine = focusLine.set('cursor', 'default');
                focusLine = focusLine.set('index', null);
                this.setState({focusLine});
            }
            return null;
        } else if (!this.canvasStart) return null;
        this.drawLines(e);
    };

    onCanvasUp = (e) => {
        let {focusCircle} = this.state;
        const {drawing, eventFieldChange} = this.props;
        if (!this.canvasStart) return null;

        let drawConnections = drawing.getIn(['drawConnections']);
        if (!focusCircle) {
            eventFieldChange(['drawConnections'], drawConnections.pop());
            this.canvasStart = false;
            this.drawLines(e);
            return null;
        }

        this.canvasStart = false;
        const index = focusCircle.get('index');
        const x = drawing.getIn(['data', index, 'position', 'x']) + focusCircle.get('deltaX');
        const y = drawing.getIn(['data', index, 'position', 'y']) + focusCircle.get('deltaY');
        const id = drawing.getIn(['data', index, 'id']);

        const size = drawConnections.size;
        if (drawConnections.getIn([size - 1, 'from', 'id']) === id) {
            drawConnections = drawConnections.pop();
        } else {
            drawConnections = drawConnections.setIn([size - 1, 'to'], fromJS({id, x, y}));
        }
        eventFieldChange(['drawConnections'], drawConnections);
        this.drawLines(e);
    };

    onCanvasDblClick = (e) => {
        let {focusLine} = this.state;
        const {drawing, eventFieldChange} = this.props;
        if (e.target.tagName !== 'CANVAS') return null;
        const index = focusLine.get('index');
        if (index !== null) {
            focusLine = focusLine.set('index', null);
            eventFieldChange(['drawConnections'], drawing.getIn(['drawConnections']).delete(index));
            this.setState({focusLine});
            setTimeout(() => this.drawLines());
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };

    setCanvasSize = () => {
        const width = document.documentElement.offsetWidth;
        let viewPort = outerContainerMaxWidth;
        if (width < outerContainerMaxWidth) {
            viewPort = width;
            this.viewPortOffset = 0;
        } else {
            this.viewPortOffset = (width - outerContainerMaxWidth) / 2;
        }
        setTimeout(() => this.drawLines());
        this.setState({viewPort});
    };

    onPrint = () => {
        html2canvas(document.getElementById('printWrapper'), {
            backgroundColor: null,
            foreignObjectRendering: true,
            scrollY: 0,
            scrollX: 0,
            y: offsetTop + canvasBorder,
            x: paddingLeft + canvasBorder + this.viewPortOffset + 1,
            width: this.state.viewPort - 2 * (paddingLeft + canvasBorder) - 1,
            height: height + offsetTop - 4 * canvasBorder
        }).then((canvas) => {
            const win = window.open();
            win.document.body.appendChild(canvas);
            win.print();
        });
    };

    componentDidMount() {
        const canvasContext = ReactDOM.findDOMNode(this).querySelector('canvas').getContext('2d');
        this.setState({canvasContext});
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
        const {viewPort, drawLayout, focusLine} = this.state;
        const {drawing} = this.props;
        console.log('######', drawing.toJS(), '######');

        const btns = [{text: 'Печать', className: 'btn-sunYellow', onClick: this.onPrint}];

        return (
            <OuterContainer style={{maxWidth: outerContainerMaxWidth, padding: `0 ${paddingLeft}px`}}>
                <div style={{height: 50, lineHeight: '50px'}}>
                    <CombinedWrapper
                        type='check'
                        hideBlock={true}
                        path='drawLayout'
                        value={drawLayout}
                        handler={(path, val) => this.setState({[path]: val})}
                    />
                    <span style={{marginLeft: 10}}>Слой рисования</span>
                    <Button
                        className='btn-sunYellow'
                        style={{marginLeft: 10}}
                        onClick={this.onAddCard}
                    >
                        Добавить карточку
                    </Button>
                    <Button
                        style={{marginLeft: 10}}
                        onClick={this.onAddSign}
                    >
                        Добавить надпись
                    </Button>
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
                            cursor: focusLine.get('cursor')
                        }}
                    >
                        <canvas
                            width={viewPort - 2 * (paddingLeft + canvasBorder)}
                            height={height - 4 * canvasBorder}
                        />
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: drawLayout ? 0 : 1,
                            left: 0,
                            top: 0,
                            boxSizing: 'border-box',
                            height: height - 4 * canvasBorder,
                            width: viewPort - 2 * (paddingLeft + canvasBorder),
                            margin: canvasBorder
                        }}
                    >
                        {this.dragCardRender()}
                        {this.dragSignRender()}
                    </div>
                </div>
                <Footer btns={btns}/>
            </OuterContainer>
        );
    }
}