import React from 'react';
import ReactDOM from 'react-dom';
import Toggle from 'react-toggle';

import '../../styles/react-toggle.css';

export default class CheckboxWrapper extends React.Component {

    onChange = ({target}) => {
        const {path, handler} = this.props;
        handler(path, target.checked)
    };

    componentDidMount() {
        const svgArr = ReactDOM.findDOMNode(this).querySelectorAll('svg');
        if (svgArr) {
            Array.from(svgArr).forEach((item) => item.setAttribute('focusable', 'false'));
        }
    }

    componentDidUpdate() {
        if (this.props.disabled) {
            const reactToggleThumb = ReactDOM.findDOMNode(this).querySelector('.react-toggle-thumb');
            if (reactToggleThumb) {
                reactToggleThumb.style.boxShadow = 'none';
            }
        }
    }

    render() {
        const {value, disabled, readonly, text} = this.props;
        return (
            <label style={{height: 36, margin: 0}}>
                <Toggle
                    checked={!!value}
                    onChange={this.onChange}
                    disabled={!!(disabled || readonly)}
                />
                {text && <span style={{marginLeft: 10, fontWeight: 'normal'}}>{text}</span>}
                <br/>
            </label>
        );
    }
}