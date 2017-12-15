import React from 'react';

export default class InputWrapper extends React.Component {

    state = {
        value: this.props.value || this.props.value === 0 ? String(this.props.value) : ''
    };

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value || nextProps.value === 0 ? String(nextProps.value) : ''});
    }

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
            <div className='text-control text-control--readonly' style={textStyle}>
                {value}
            </div>
        );
    };

    render() {
        const {value} = this.state;
        const {placeholder = 'Введите значение', maxLength = 255, disabled, inputStyle, readonly, textStyle = {}} = this.props;

        if (readonly) {
            return this.readonlyJSX(value);
        }
        return (
            <input
                className='text-control'
                value={value}
                onChange={this.onChange}
                onBlur={this.onBlur}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={!!disabled}
                style={{...inputStyle, ...textStyle}}
            />
        );
    }
}