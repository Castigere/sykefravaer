import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, change, touch, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { toDatePrettyPrint } from 'digisyfo-npm';
import MaskedInput from 'react-maskedinput';
import { Vis } from '../../../utils';
import Feilmelding from '../Feilmelding';
import DayPickerComponent from './DayPicker';
import { validerDatoField } from './validering';
import { fieldPropTypes } from '../../../propTypes';

export class DatoField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            erApen: false,
        };
    }

    onKeyUp(e) {
        const ESCAPE_KEYCODE = 27;
        if (e.which === ESCAPE_KEYCODE) {
            this.lukk();
        }
    }

    toggleApen() {
        if (this.state.erApen) {
            this.lukk();
        } else {
            this.apne();
        }
    }

    apne() {
        this.setState({
            erApen: true,
        });
    }

    lukk() {
        this.setState({
            erApen: false,
        });
        if (this.toggle) {
            this.toggle.focus();
        }
    }

    parseVerdi(jsDato) {
        const verdi = toDatePrettyPrint(new Date(jsDato));
        return !this.props.parseVerdi
            ? verdi
            : this.props.parseVerdi(verdi);
    }

    render() {
        const { meta, input, id, tidligsteFom, senesteTom } = this.props;
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return (<div className="datovelger">
            <div
                className="datovelger__inner"
                onClick={(event) => {
                    try {
                        event.nativeEvent.stopImmediatePropagation();
                    } catch (e) {
                        event.stopPropagation();
                    }
                }}>
                <div className="datovelger__inputContainer">
                    <MaskedInput
                        type="tel"
                        mask="11.11.1111"
                        autoComplete="off"
                        placeholder="dd.mm.åååå"
                        id={id}
                        className={`datovelger__input${meta.touched && meta.error ? ' input--feil' : ''}`}
                        {...input} />
                    <button
                        type="button"
                        className="js-toggle datovelger__toggleDayPicker"
                        ref={(c) => {
                            this.toggle = c;
                        }}
                        id={`toggle-${id}`}
                        onKeyUp={(e) => {
                            this.onKeyUp(e);
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            this.toggleApen();
                        }}
                        aria-pressed={this.state.erApen}>
                        {this.state.erApen ? 'Skjul datovelger' : 'Vis datovelger'}
                    </button>
                </div>
                <Vis hvis={this.state.erApen}>
                    <DayPickerComponent
                        {...this.props}
                        erApen={this.state.erApen}
                        tidligsteFom={tidligsteFom}
                        senesteTom={senesteTom}
                        onDayClick={(event, jsDato) => {
                            const verdi = this.parseVerdi(jsDato);
                            this.props.change(meta.form, this.props.input.name, verdi);
                            this.props.touch(meta.form, this.props.input.name);
                            this.lukk();
                        }}
                        onKeyUp={(e) => {
                            this.onKeyUp(e);
                        }}
                        lukk={() => {
                            this.lukk();
                        }} />
                </Vis>
                <Feilmelding {...meta} />
            </div>
        </div>);
        /* eslint-enable jsx-a11y/no-static-element-interactions */
    }
}

DatoField.propTypes = {
    meta: fieldPropTypes.meta,
    id: PropTypes.string.isRequired,
    input: fieldPropTypes.input,
    touch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    parseVerdi: PropTypes.func,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
};

const mapStateToProps = (state, ownProps) => {
    const inputName = ownProps.input.name;
    const skjemanavn = ownProps.meta.form;
    const selector = formValueSelector(skjemanavn);
    const inputValue = selector(state, inputName);
    return {
        inputValue,
    };
};

const ConnectedDatoField = connect(mapStateToProps, { change, touch })(DatoField);

export const genererValidate = (props) => {
    return (verdi) => {
        const formatertVerdi = props.format
            ? props.format(verdi)
            : verdi;
        return validerDatoField(formatertVerdi, {
            fra: props.tidligsteFom,
            til: props.senesteTom,
        });
    };
};

const Datovelger = (props) => {
    const validate = genererValidate(props);
    return (<Field
        component={ConnectedDatoField}
        validate={validate}
        {...props} />);
};

Datovelger.propTypes = {
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
    validate: PropTypes.func,
};

export default Datovelger;
