import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select-plus';
import {Portal} from 'react-overlays';
import {List} from 'immutable';

import 'react-select-plus/dist/react-select-plus.css';

export default class SelectWrapper extends React.Component {

    state = {
        menuContainerStyle: {}
    };

    onFocus = () => {
        this.setMenuPosition();
    };

    onChange = (newValue) => {
        const {path, handler, value, multi, valueKey = 'internalId'} = this.props;
        if (newValue) {
            if (multi) {
                const valueArr = [];
                newValue.forEach((item) => {
                    valueArr.push(item[valueKey]);
                });
                handler(path, valueArr.length > 0 ? valueArr : null);
                setTimeout(() => this.setMenuPosition());
            } else {
                const idValue = newValue[valueKey];
                if (idValue !== value) handler(path, idValue);
            }
        } else {
            if (newValue !== value) handler(path, newValue);
        }
    };

    setMenuPosition = () => {
        const select = ReactDOM.findDOMNode(this).querySelector('div.Select-control');
        const coord = select.getBoundingClientRect();
        this.setState({
            menuContainerStyle: {
                top: document.documentElement.scrollTop + coord.bottom,
                left: coord.left,
                width: window.getComputedStyle(select).width
            }
        });
    };

    dropdownComponent = ({children}) => (
        <Portal show rootClose={false} container={document.body}>
            {children}
        </Portal>
    );

    componentDidMount() {
        if (this.props.readonly) return;
        const arr = ReactDOM.findDOMNode(this).querySelectorAll('div[tabindex]');
        if (arr.length) {
            Array.from(arr).forEach((item) => item.removeAttribute('tabindex'));
        }
    }

    readonlyJSX = (newValue) => {
        const {labelKey = 'name'} = this.props;
        let str = '';
        if (newValue) {
            if (this.props.multi) {
                const strArr = [];
                newValue.forEach((item) => strArr.push(item[labelKey]));
                str = strArr.join('; ')
            } else {
                str = newValue[labelKey];
            }
        }
        return (
            <div className='text-control text-control--readonly'>
                {str}
            </div>
        );
    };

    render() {
        const {menuContainerStyle} = this.state;
        const {model = List([]), value = null, placeholder = 'Выберите значение', disabled,
            readonly, multi = false, inputStyle, labelKey = 'name', valueKey = 'internalId'} = this.props;
        let newValue = multi ? [] : value;

        if (value) {
            if (multi) {
                value.toJS().forEach((valItem) => {
                    for (let i = 0; i < model.size; i++) {
                        if (model.getIn([i, valueKey]) == valItem) {
                            newValue.push(model.get(i).toJS());
                            break;
                        }
                    }
                });
            } else {
                model.toJS().forEach((item) => {
                    if (item[valueKey] == newValue) {
                        newValue = item;
                    }
                });
            }
        }

        if (readonly) {
            return this.readonlyJSX(newValue);
        }

        return (
            <Select
                value={newValue}
                options={model.toJS()}
                disabled={!!disabled}
                multi={multi}
                openOnFocus={true}
                onChange={this.onChange}
                onFocus={this.onFocus}
                labelKey={labelKey}
                valueKey={valueKey}
                placeholder={placeholder}
                noResultsText='Совпадений не найдено'
                clearValueText='Удалить значение'
                dropdownComponent={this.dropdownComponent}
                menuContainerStyle={menuContainerStyle}
                style={inputStyle}
            />
        );
    }
}