import React, { Component, PropTypes } from 'react';
import { erGyldigDato, erGyldigDatoformat } from '../../utils';
import { Field } from 'redux-form';
import Feilmelding from './Feilmelding';
import { connect } from 'react-redux';
import { SYKEPENGER_SKJEMANAVN } from '../sykepengesoknad/setup';
import MaskedInput from 'react-maskedinput';
import { toDatePrettyPrint } from 'digisyfo-npm';
import DayPickerComponent from './DayPicker';
import { autofill, touch } from 'redux-form';
import { fraInputdatoTilJSDato } from '../../utils';

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

    toggle() {
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
        this.refs.toggle.focus();
    }

    render() {
        const { meta, input, id, tidligsteFom, senesteTom } = this.props;

        return (<div className="datovelger">
            <div className="datovelger__inner" onClick={(event) => {
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
                        className={`datovelger__input${meta.touched && meta.error ? ' input--feil' : ''}`} {...input} />
                    <button
                        className="js-toggle datovelger__toggleDayPicker"
                        ref="toggle"
                        id={`toggle-${id}`}
                        onKeyUp={(e) => {
                            this.onKeyUp(e);
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            this.toggle();
                        }}
                        aria-pressed={this.erApen}>
                        {this.state.erApen ? 'Skjul datovelger' : 'Vis datovelger'}
                    </button>
                </div>
                { this.state.erApen && <DayPickerComponent
                    {...this.props}
                    ariaControlledBy={`toggle-${id}`}
                    tidligsteFom={tidligsteFom}
                    senesteTom={senesteTom}
                    onDayClick={(event, jsDato) => {
                        const { dispatch, skjemanavn } = this.props;
                        const s = toDatePrettyPrint(new Date(jsDato));
                        dispatch(autofill(skjemanavn, this.props.input.name, s));
                        dispatch(touch(skjemanavn, this.props.input.name));
                        this.lukk();
                    }}
                    onKeyUp={(e) => {
                        this.onKeyUp(e);
                    }}
                    lukk={() => {
                        this.lukk();
                    }} />}
                <Feilmelding {...meta} />
            </div>
        </div>);
    }
}

DatoField.propTypes = {
    meta: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    skjemanavn: PropTypes.string.isRequired,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
};

const ConnectedDatoField = connect()(DatoField);

export const validerPeriode = (input, alternativer) => {
    const { fra, til } = alternativer;
    const inputDato = fraInputdatoTilJSDato(input);
    if (fra && til && (inputDato < fra || inputDato > til)) {
        return `Datoen må være innenfor perioden ${toDatePrettyPrint(fra)}-${toDatePrettyPrint(til)}`;
    }
    if (til && inputDato > til) {
        return `Datoen må være før ${toDatePrettyPrint(til)}`;
    }
    if (fra && inputDato < fra) {
        return `Datoen må være etter ${toDatePrettyPrint(fra)}`;
    }
    return undefined;
};

export const validerDatoField = (input, alternativer) => {
    if (!input) {
        return undefined;
    } else if (!erGyldigDatoformat(input)) {
        return 'Datoen må være på formatet dd.mm.åååå';
    } else if (!erGyldigDato(input)) {
        return 'Datoen er ikke gyldig';
    } else if (alternativer && alternativer.fra || alternativer.til) {
        return validerPeriode(input, alternativer);
    }
    return undefined;
};

const Datovelger = (props) => {
    return (<Field
        component={ConnectedDatoField}
        skjemanavn={SYKEPENGER_SKJEMANAVN}
        validate={(input) => {
            return validerDatoField(input, {
                fra: props.tidligsteFom,
                til: props.senesteTom,
            });
        }}
        {...props} />);
};

Datovelger.propTypes = {
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
};

export default Datovelger;
