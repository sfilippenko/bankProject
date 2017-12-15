import React from 'react';
import MaskedInput from 'react-text-mask';

export default class MaskedInputWrapper extends React.Component {

    formatDecimalNum = (value) => {
        const {maskType} = this.props;
        let val = value;
        if (maskType.endsWith('Decimal')) {
            if (/\./.test(value)) {
                val = value.replace(/\./, ',');
            }
            const reg = /,\d{0,2}/;
            let match = val.match(reg);
            if (match) {
                while (match[0].length !== 3) {
                    val += '0';
                    match = val.match(reg);
                }
            } else {
                if (val) val += ',00';
            }
            return val;
        }
        return value;
    };

    state = {
        value: this.props.value || this.props.value === 0 ? this.formatDecimalNum(String(this.props.value)) : ''
    };

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value || nextProps.value === 0 ? this.formatDecimalNum(String(nextProps.value)) : ''});
    }

    onChange = ({target}) => {
        this.setState({value: target.value});
    };

    onBlur = () => {
        const {path, handler, maskType} = this.props;
        let {value} = this.state;
        if (/\s/.test(value)) {
            value = value.replace(/\s/g, '');
        }
        value = this.formatDecimalNum(value);
        this.setState({value});
        if (maskType.endsWith('Decimal')) {
            if (!value) value = null;
            else {
                value = value.replace(/,/, '.');
                value = Number(value);
            }
        }
        if (value !== this.props.value) {
            handler(path, value);
        }
    };

    readonlyJSX = (value) => {
        const {maskType} = this.props;
        let val = value;
        if (val && maskType.endsWith('Decimal')) {
            val = val.replace(/,/, '.');
            val = String(Math.round(val * 100) / 100);
            const split = val.split('.');
            let ending = split[1] || '00';
            while (ending.length !== 2) {
                ending += '0';
            }
            val = split[0];
            const length = val.length;
            if (val.length > 3) {
                for (let i = 0; i < length - 1; i++) {
                    if ((i + 1) % 3 === 0) {
                        const border = i + 1 + Math.floor(i / 3);
                        val = val.slice(0, val.length - border) + ' ' + val.slice(-border);
                    }
                }
            }
            val = val + ',' + ending;
        }
        return (
            <div className='text-control text-control--readonly'>
                {val}
            </div>
        );
    };

    render() {
        const {value = ''} = this.state;
        const {maskType} = this.props;
        let defaultMask;
        if (maskType) {
            defaultMask = require('../../constants/masks')[maskType];
        } else {
            defaultMask = {mask: [], ph: 'Введите значение'};
        }

        const {disabled, mask = defaultMask.mask, placeholder = defaultMask.ph, pipe, inputStyle, readonly} = this.props;

        if (readonly) {
            return this.readonlyJSX(value);
        }

        return (
            <MaskedInput
                className='text-control'
                disabled={!!disabled}
                mask={mask}
                placeholder={placeholder}
                value={value}
                onChange={this.onChange}
                onBlur={this.onBlur}
                guide={false}
                keepCharPositions={false}
                pipe={pipe}
                style={inputStyle}
            />
        );
    }
}
