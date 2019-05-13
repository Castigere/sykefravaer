import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Feilomrade from '../Feilomrade';
import { fieldPropTypes } from '../../../propTypes/index';

const getQueryIndex = (query, forslag) => {
    return forslag.getText()
        .toLowerCase()
        .indexOf(query.toLowerCase());
};

const getSuggestionValue = (forslag) => {
    return forslag.getText();
};

const renderSuggestion = (forslag, { query }) => {
    const escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    const html = {
        __html: forslag.getText().replace(RegExp(escapedRegex, 'gi'), (x) => {
            return `<mark>${unescape(x)}</mark>`;
        }),
    };
    return (<div dangerouslySetInnerHTML={html} />);
};

class NavAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
        };
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue,
        });
    }

    onSuggestionsFetchRequested({ value }) {
        const eksakteForslag = this.props.forslagsliste.filter((forslag) => {
            return getQueryIndex(value, forslag) === 0;
        });
        const delvisMatchForslag = this.props.forslagsliste.filter((forslag) => {
            return getQueryIndex(value, forslag) > 0;
        });
        const suggestions = [...eksakteForslag, ...delvisMatchForslag].slice(0, 5);
        this.setState({
            suggestions,
        });
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
        });
    }

    render() {
        return (<Feilomrade {...this.props.meta}>
            <Autosuggest
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={(event, { suggestion }) => {
                    const ENTER = 13;
                    if (event.keyCode === ENTER) {
                        event.preventDefault();
                    }
                    this.setState({
                        value: '',
                    });
                    this.props.onAdd(suggestion);
                }}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                suggestions={this.state.suggestions}
                inputProps={{
                    value: this.state.value,
                    onChange: this.onChange,
                    name: this.props.id,
                    className: 'skjemaelement__input input--m',
                }}
                id={this.props.id}
                name={this.props.name}
            />
        </Feilomrade>);
    }
}

NavAutosuggest.propTypes = {
    forslagsliste: PropTypes.arrayOf(PropTypes.shape({
        tag: PropTypes.string,
    })),
    id: PropTypes.string,
    name: PropTypes.string,
    meta: fieldPropTypes.meta,
    onAdd: PropTypes.func,
};

export default NavAutosuggest;
