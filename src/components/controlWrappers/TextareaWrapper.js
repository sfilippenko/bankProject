import React from 'react';

export default class TextareaWrapper extends React.Component {

    state = {
        value: this.props.value || this.props.value === 0 ? String(this.props.value) : ''
    };

    onChange = ({target}) => {
        this.setState({value: target.value});
    };

    onBlur = () => {
        const {path, handler} = this.props;
        const {value} = this.state;
        if (value !== this.props.value) handler(path, value);
    };

    readonlyJSX = (value) => {
        const {textStyle} = this.props;
        return (
            <div className='text-control text-control--textarea text-control--readonly' style={textStyle}>
                {value}
            </div>
        );
    };

    render() {
        const {value} = this.state;
        const {placeholder = 'Введите значение', maxLength = 2047, disabled, readonly, textStyle = {}, inputStyle} = this.props;

        if (readonly) {
            return this.readonlyJSX(value);
        }
        return (
            <textarea
                className='text-control text-control--textarea'
                value={value}
                onChange={this.onChange}
                onBlur={this.onBlur}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={!!disabled}
                style={{...textStyle, ...inputStyle}}
            />
        );
    }
}