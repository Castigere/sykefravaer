import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import CheckboxSelvstendig from '../skjema/CheckboxSelvstendig';
import { getLedetekst, Varselstripe } from 'digisyfo-npm';
import { bekreftAktivitetskrav } from '../../actions/aktivitetskrav_actions';
import { connect } from 'react-redux';

const Aktivitetskrav = ({ handleSubmit, ledetekster, actions, bekrefter, bekreftFeilet }) => {
    return (<form onSubmit={handleSubmit(() => {
        actions.bekreftAktivitetskrav();
    })}>
        <div role="alert" aria-live="polite">
            { bekreftFeilet && (<div className="panel panel--komprimert blokk">
                <Varselstripe fylt type="feil">
                    <p className="sist">Beklager! Det oppstod en feil! Prøv igjen litt senere.</p>
                </Varselstripe>
            </div>) }
        </div>
        <div className="bekreftAktivitetskrav">
            <Field name="bekreftAktivitetskrav" component={CheckboxSelvstendig} id="bekreftAktivitetskrav" label={getLedetekst('aktivitetskrav-varsel.bekreft-label', ledetekster)} />
        </div>
        <div className="knapperad">
            <button className="submit" type="submit" className={`knapp${bekrefter ? ' knapp--spinner' : ''}`}>
                Bekreft
                { bekrefter && <span className="knapp__spinner" /> }
            </button>
        </div>
    </form>);
};

Aktivitetskrav.propTypes = {
    handleSubmit: PropTypes.func,
    ledetekster: PropTypes.object,
    actions: PropTypes.object,
    bekrefter: PropTypes.bool,
    bekreftFeilet: PropTypes.bool,
};

const validate = (values) => {
    if (!values.bekreftAktivitetskrav) {
        return {
            bekreftAktivitetskrav: 'Du må bekrefte at du har lest all informasjonen du har fått',
        };
    }
    return {};
};

const form = reduxForm({
    form: 'BEKREFT_AKTIVITETSKRAV',
    validate,
})(Aktivitetskrav);

const mapStateToProps = (state) => {
    return {
        ledetekster: state.ledetekster.data,
        bekrefter: state.aktivitetskrav.bekrefter,
        bekreftFeilet: state.aktivitetskrav.bekreftFeilet,
    };
};

const connectedForm = connect(mapStateToProps, { actions: { bekreftAktivitetskrav } })(form);

export default connectedForm;