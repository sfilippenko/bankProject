import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-bootstrap-date-picker';
import {convertDate} from '../../constants/functions';

const dayLabels = ['Вск', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export default class DatePickerWrapper extends React.Component {

    state = {
        calendarPlacement: 'bottom'
    };

    setCalendarPlacement = (input) => {
        if (this.props.readonly) return;
        const inputBottom = input.getBoundingClientRect().bottom;
        if (window.innerHeight - inputBottom < 280) {
            this.setState({calendarPlacement: 'top'});
        } else {
            this.setState({calendarPlacement: 'bottom'});
        }
    };

    componentDidMount() {
        const input = ReactDOM.findDOMNode(this).querySelector('input.form-control');
        this.setCalendarPlacement(input);
    }

    onFocus = () => {
        const {placeholder = 'Выберите дату'} = this.props;
        const button = ReactDOM.findDOMNode(this).querySelector('button.u-today-button');
        const input = ReactDOM.findDOMNode(this).querySelector('input.form-control');
        this.setCalendarPlacement(input);
        setTimeout(() => {
            if (button) {
                button.setAttribute('tabindex', '-1');
            }
            if (input) {
                input.setAttribute('placeholder', placeholder);
            }

        });
    };

    onChange = (newValue) => {
        const {path, handler, value} = this.props;
        if (newValue) {
            const newDateMS = new Date(newValue).valueOf();
            if (newDateMS !== value) handler(path, newDateMS);
        }
        this.setState({errorPopoverDisplay: 'none'});
    };

    onClear = () => {
        const {path, handler, value} = this.props;
        if (value) {
            handler(path, null);
            const input = ReactDOM.findDOMNode(this).querySelector('input.form-control');
            input.focus();
            this.setState({errorPopoverDisplay: 'none'});
        }
    };

    readonlyJSX = (value) => {
        return (
            <div className='text-control text-control--readonly'>
                {convertDate(value)}
            </div>
        );
    };

    render() {
        const {calendarPlacement} = this.state;
        let {
            value = '',
            dateFormat = 'DD.MM.YYYY',
            disabled,
            placeholder = 'Выберите дату',
            readonly,
            inputStyle
        } = this.props;

        if (readonly) {
            return this.readonlyJSX(value);
        }
        if (value) value = new Date(Number(value)).toISOString();

        return (
            <DatePicker
                ref='myDatePicker'
                value={value}
                disabled={!!disabled}
                dateFormat={dateFormat}
                dayLabels={dayLabels}
                monthLabels={monthLabels}
                weekStartsOn={1}
                showTodayButton={true}
                todayButtonLabel='Сегодня'
                onChange={this.onChange}
                onClear={this.onClear}
                onFocus={this.onFocus}
                placeholder={placeholder}
                calendarPlacement={calendarPlacement}
                calendarContainer={document.body}
                style={inputStyle}
            />
        );
    }

}