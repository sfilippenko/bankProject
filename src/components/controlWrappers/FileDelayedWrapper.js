import React from 'react';
import Dropzone from 'react-dropzone';

export default class FileDelayedWrapper extends React.Component {

    render() {
        const {placeholder = 'Выберите файл', value, accept = '', disabled, inputStyle, path,
            multiple = false, onFileDrop, onFileDelete} = this.props;
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
                onDrop={onFileDrop(path)}
                disabled={!!disabled}
                disableClick={!!value}
            >
                {
                    !value && <span style={{color: 'rgba(0,0,0,0.5)', fontSize: '12px', lineHeight: '34px'}}>{placeholder}</span>
                }
                {
                    value &&
                    <span style={{fontSize: '12px'}}>{value}</span>
                }
                {
                    value &&
                    <span
                        className='Select-clear-zone'
                        style={{position: 'absolute', right: 10, bottom: -2, zIndex: 2, lineHeight: '34px'}}
                        onClick={onFileDelete(path)}
                    >
                        <span className='Select-clear'>{'\u00D7'}</span>
                    </span>
                }
            </Dropzone>
        );
    }
}