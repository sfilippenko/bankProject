import React, {Component} from 'react';
import './CheckBox.style.scss';

export default class CheckBox extends Component {

    // state = {
    //     value: this.props.value
    // };
    //
    // componentWillReceiveProps(nextProps) {
    //     this.setState({value: nextProps.value});
    // }

    render() {
        const {value, handler, readonly} = this.props;
        return (
            <div onClick={handler} className={readonly ? 'boxes cantDelete' : 'boxes'}>
                <input
                    type='checkbox'
                    checked={value}
                />
                <label/>
            </div>
        );
    }
}

