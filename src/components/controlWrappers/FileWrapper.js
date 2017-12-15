import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

const canvasSize = 20;

export default class FileWrapper extends React.Component {

    canvasContext = null;

    componentDidMount() {
        this.canvasContext = ReactDOM.findDOMNode(this).querySelector('canvas').getContext('2d');
        this.canvasContext.strokeStyle = 'rgb(35, 132, 65)';
        this.canvasContext.lineWidth = 3;
    }

    render() {
        const {placeholder = 'Выберите файл', value, accept = '', disabled, readonly, inputStyle, multiple = false} = this.props;
        return (
            <Dropzone
                value='value'
                className='file-box'
                acceptClassName='file-box file-box--accepted'
                rejectClassName='file-box file-box--rejected'
                disabledClassName='file-box file-box--disabled'
                style={inputStyle}
                multiple={multiple}
                accept={accept}
                onDrop={this.onDrop}
                disabled={!!(disabled || readonly)}
                disableClick={!!value}
            >
                {
                    !value && <span style={{color: 'rgba(0,0,0,0.5)', fontSize: '12px', lineHeight: '34px'}}>{!(disabled || readonly) && placeholder}</span>
                }
                {
                    value &&
                    <a
                        style={{fontSize: '12px'}}
                        target='_blank'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {multiple ? value.getIn([0, 'name']) :  value.get('name')}
                    </a>
                }
                {
                    value && !(disabled || readonly) &&
                    <span
                        className='Select-clear-zone'
                        style={{position: 'absolute', right: 10, bottom: -2, zIndex: 2, lineHeight: '34px'}}
                        onClick={this.onDelete}
                    >
                        <span className='Select-clear'>{'\u00D7'}</span>
                    </span>
                }
                <canvas width={canvasSize} height={canvasSize} style={{position: 'absolute', right: 10, bottom: 6}}/>
            </Dropzone>
        );
    }
}