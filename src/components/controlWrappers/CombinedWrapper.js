import React from 'react';
import ReactTooltip from 'react-tooltip';
import AutocompleteWrapper from './AutocompleteWrapper';
import CheckboxWrapper from './CheckboxWrapper';
import DatePickerWrapper from './DatePickerWrapper';
import TextWrapper from './TextWrapper';
import TextareaWrapper from './TextareaWrapper';
import MaskedInputWrapper from './MaskedInputWrapper';
import SelectWrapper from './SelectWrapper';
import FileDelayedWrapper from './FileDelayedWrapper';
import FileWrapper from './FileWrapper';
import {List} from 'immutable';

const notValidStyle = {
    backgroundColor: 'rgba(255, 0, 0, 0.2)'
};

export default class CombinedWrapper extends React.Component {

    shouldComponentUpdate(nextProps) {
        const {value, validate, disabled, readonly, model, title} = nextProps;
        return (
            value !== this.props.value || disabled !== this.props.disabled ||
            readonly !== this.props.readonly || title !== this.props.title ||
            (validate) ||
            (model || List([])).size !== (this.props.model || List([])).size
        );
    }


    render() {
        console.log('CombinedWrapper renders');
        const {type, hideBlock, title, validate, path, validName, blockStyle, valueStyle, labelStyle,
            errorText = (type === 'file' || type === 'fileDelayed') ? 'Прикрепите файл' : 'Поле обязательно для заполнения',
            labelTop} = this.props;
        const name = validName || validate && path && path.join('.');
        const notValid = false;
        const inputStyle = (validate && notValid) ? notValidStyle : {};
        let contentJsx = <div/>;
        switch (type) {
            case 'text': {
                contentJsx = <TextWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'textarea': {
                contentJsx = <TextareaWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'select': {
                contentJsx = <SelectWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'mask': {
                contentJsx = <MaskedInputWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'check': {
                contentJsx = <CheckboxWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'date': {
                contentJsx = <DatePickerWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'file': {
                contentJsx = <FileWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'fileDelayed': {
                contentJsx = <FileDelayedWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
            case 'autocomplete': {
                contentJsx = <AutocompleteWrapper {...this.props} inputStyle={inputStyle}/>;
                break;
            }
        }
        if (validate) {
            contentJsx = (
                <div>
                    <div data-tip data-for={name}>
                        {contentJsx}
                    </div>
                    <ReactTooltip
                        id={name}
                        type='error'
                        effect='solid'
                        place='bottom'
                        delayShow={300}
                        disable={!notValid}
                    >
                        <div>{errorText}</div>
                    </ReactTooltip>
                </div>
            );
        }
        if (!hideBlock) {
            contentJsx = (
                <div className={labelTop ? 'control-block control-block--labelTop' : 'control-block'} style={blockStyle}>
                    <div className='control-block__label' style={labelStyle}>
                        {title}
                    </div>
                    <div className='control-block__value' style={{height: type === 'textarea' ? 36 : 'auto',...valueStyle}}>{contentJsx}</div>
                </div>
            );
        }
        return contentJsx;
    }
}