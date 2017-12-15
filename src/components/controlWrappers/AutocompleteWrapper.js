import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import {Portal} from 'react-overlays';
import axios from 'axios';
const CancelToken = axios.CancelToken;
import {hashHistory} from 'react-router'

const timeout = 300;

const hardInputStyle = {
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: '0 20px 0 10px',
    width: '100%',
    fontSize: '12px',
    height: '36px',
    lineHeight: '36px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

export default class AutocompleteWrapper extends React.Component {

    state = {
        value: this.props.value && this.props.value.get('name') || '',
        suggestions: [],
        loading: false
    };

    id = -1;
    containerStyle = {};
    cancel = () => true;
    time = null;

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value && nextProps.value.get('name') || ''});
    }

    getSuggestionValue = (suggestion) => suggestion;

    renderSuggestion = (suggestion) => (
        <div>
            {suggestion.name}
        </div>
    );

    onChange = (event, { newValue, method }) => {
        const now = Date.now();
        if (this.time && now - this.time < timeout) {
            clearTimeout(this.timeout);
        }
        this.time = now;
        let value = newValue;
        let loading;
        if (method !== 'type') {
            this.id = newValue.id;
            value = newValue.name;
            loading = false;
        } else {
            loading = value.length > 0;
        }
        this.setState({value, loading});
    };

    onBlur = () => {
        this.cancel();
        const {path, handler} = this.props;
        const {value, suggestions} = this.state;
        if (value !== (this.props.value && this.props.value.get('name'))) {
            let obj = {name: value, id: this.id};
            suggestions.forEach((item) => {
                if (item.name.toLowerCase() === value.toLowerCase()) obj = item;
            });
            handler(path, obj);
        }
        this.setState({loading: false});
        this.id = -1;
        this.time = null;
    };

    onSuggestionsFetchRequested = ({value}) => {
        const {url} = this.props;
        const inputValue = value.trim();
        if (inputValue.length === 0) return null;
        this.timeout = setTimeout(() => {
            axios.get(url + inputValue, {
                cancelToken: new CancelToken((c) => this.cancel = c)
            }).then(({data}) => {
                if (data.details.status === 'NOT_AUTHORIZED') {
                    hashHistory.push('/login');
                    return null;
                }
                this.setState({suggestions: data.data});
                this.setState({loading: false});
            }).catch((e) => {
                this.setState({loading: false});
                console.log(e)
            });
        }, timeout);
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    setContainerPosition = () => {
        const container = ReactDOM.findDOMNode(this);
        const coord = container.getBoundingClientRect();
        this.containerStyle = {
            top: document.documentElement.scrollTop + coord.bottom,
            left: coord.left,
            width: window.getComputedStyle(container).width
        }
    };

    renderSuggestionsContainer = ({containerProps , children}) => {
        return (
            <Portal show rootClose={false} container={document.body}>
                <div style={this.containerStyle} {...containerProps}>
                    {children}
                </div>
            </Portal>
        );
    };

    componentDidMount() {
        this.setContainerPosition();
    }

    componentDidUpdate() {
        this.setContainerPosition();
    }

    render() {
        const {value, suggestions, loading} = this.state;
        const {placeholder = 'Введите значение', inputStyle} = this.props;

        const inputProps = {
            placeholder,
            value,
            onChange: this.onChange,
            onBlur: this.onBlur
        };

        return (
            <div style={{position: 'relative'}}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    shouldRenderSuggestions={() => true}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    focusInputOnSuggestionClick={true}
                    renderSuggestionsContainer={this.renderSuggestionsContainer}
                    theme={{
                        container: 'react-autosuggest__container',
                        containerOpen: 'react-autosuggest__container--open',
                        input: {...hardInputStyle, ...inputStyle},
                        inputOpen: 'react-autosuggest__input--open',
                        inputFocused: {border: '1px solid #007eff', outline: 'none'},
                        suggestionsContainer: 'react-autosuggest__suggestions-container',
                        suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
                        suggestionsList: 'react-autosuggest__suggestions-list',
                        suggestion: 'react-autosuggest__suggestion',
                        suggestionFirst: 'react-autosuggest__suggestion--first',
                        suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
                        sectionContainer: 'react-autosuggest__section-container',
                        sectionContainerFirst: 'react-autosuggest__section-container--first',
                        sectionTitle: 'react-autosuggest__section-title'
                    }}
                />
                {loading && <div className='loader'/>}
            </div>
        );
    }
}