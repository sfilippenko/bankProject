import React from 'react';
import CheckboxWrapper from './CheckboxWrapper';

export default class CombinedWrapper extends React.Component {

    render() {
        const {type, hideBlock, title, blockStyle, valueStyle, labelStyle, labelTop} = this.props;
        let contentJsx = <div/>;
        switch (type) {
            case 'check': {
                contentJsx = <CheckboxWrapper {...this.props}/>;
                break;
            }
        }
        if (!hideBlock) {
            contentJsx = (
                <div className={labelTop ? 'control-block control-block--labelTop' : 'control-block'}
                     style={blockStyle}>
                    <div className='control-block__label' style={labelStyle}>
                        {title}
                    </div>
                    <div className='control-block__value'
                         style={{height: type === 'textarea' ? 36 : 'auto', ...valueStyle}}>{contentJsx}</div>
                </div>
            );
        }
        return contentJsx;
    }
}