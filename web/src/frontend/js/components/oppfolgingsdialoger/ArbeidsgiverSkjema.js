import React, { PropTypes } from 'react';
import { getLedetekst } from 'digisyfo-npm';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import {
    erOppfolgingsdialogOpprettetMedArbeidsgiver,
    erOppfolgingsdialogOpprettbarMedArbeidsgiver,
    erOppfolgingsdialogOpprettbarMedMinstEnArbeidsgiver,
} from '../../utils/oppfolgingsdialogUtils';
import Radioknapper from '../skjema/Radioknapper';

const OPPFOLGINGSKJEMANAVN = 'OPPRETT_DIALOG';

export const VelgArbeidsgiverUndertekst = ({ oppfolgingsdialoger, arbeidsgiver }) => {
    if (erOppfolgingsdialogOpprettetMedArbeidsgiver(oppfolgingsdialoger, arbeidsgiver.virksomhetsnummer)) {
        return (<div className="velgArbeidsgiverUndertekst">
            <img className="velgArbeidsgiverUndertekst__ikon" src="/sykefravaer/img/svg/varseltrekant.svg" alt="varsel" />
            <span className="velgArbeidsgiverUndertekst__tekst">{getLedetekst('oppfolgingsdialog.arbeidstaker.opprett.varsel.allerede-oppretettet.tekst')}</span>
        </div>);
    } else if (!arbeidsgiver.harNaermesteLeder) {
        return (<div className="velgArbeidsgiverUndertekst">
            <img className="velgArbeidsgiverUndertekst__ikon" src="/sykefravaer/img/svg/varseltrekant.svg" alt="varsel" />
            <span className="velgArbeidsgiverUndertekst__tekst">{getLedetekst('oppfolgingsdialog.arbeidstaker.opprett.varsel.ingen-naermesteleder.tekst')}</span>
        </div>);
    } else if (arbeidsgiver.naermesteLeder) {
        return (<div className="velgArbeidsgiverUndertekst">
            <span className="velgArbeidsgiverUndertekst__tekst">
                {getLedetekst('oppfolgingsdialog.arbeidstaker.opprett.varsel.naermeste-leder-navn', {
                    '%NAVN%': arbeidsgiver.naermesteLeder,
                })}
            </span>
            </div>
        );
    }
    return (null);
};
VelgArbeidsgiverUndertekst.propTypes = {
    oppfolgingsdialoger: PropTypes.array,
    arbeidsgiver: PropTypes.object,
};
export const VelgArbeidsgiverRadioKnapper = ({ input, meta, oppfolgingsdialoger, arbeidsgivere }) => {
    return (
        <Radioknapper
            input={input}
            meta={meta}
            visUndertekst
        >
        {
            arbeidsgivere.map((arbeidsgiver, index) => {
                return (
                    <input
                        key={index}
                        value={arbeidsgiver.virksomhetsnummer}
                        label={arbeidsgiver.navn}
                        disabled={!erOppfolgingsdialogOpprettbarMedArbeidsgiver(oppfolgingsdialoger, arbeidsgiver)}>
                        <VelgArbeidsgiverUndertekst
                            oppfolgingsdialoger={oppfolgingsdialoger}
                            arbeidsgiver={arbeidsgiver}
                        />
                    </input>
                );
            })
        }
        </Radioknapper>
  );
};
VelgArbeidsgiverRadioKnapper.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    oppfolgingsdialoger: PropTypes.array,
    arbeidsgivere: PropTypes.array,
};

export const ArbeidsgiverSkjema = ({ arbeidsgivere, oppfolgingsdialoger, handleSubmit, avbrytHref }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="inputgruppe velgarbeidsgiver__inputgruppe">
                <Field
                    name="arbeidsgiver"
                    component={VelgArbeidsgiverRadioKnapper}
                    oppfolgingsdialoger={oppfolgingsdialoger}
                    arbeidsgivere={arbeidsgivere}
                />
            </div>

            <div className="knapperad">
                <button
                    type="submit"
                    className="knapp knapperad__element"
                    disabled={!erOppfolgingsdialogOpprettbarMedMinstEnArbeidsgiver(oppfolgingsdialoger, arbeidsgivere)}>
                    {getLedetekst('oppfolgingsdialog.arbeidstaker.knapp.velg-arbeidsgiver')}
                </button>
                <Link className="lenke lenke--avbryt" to={avbrytHref}>
                    {getLedetekst('oppfolgingsdialog.knapp.avbryt')}
                </Link>
            </div>
        </form>);
};

ArbeidsgiverSkjema.propTypes = {
    arbeidsgivere: PropTypes.array,
    oppfolgingsdialoger: PropTypes.array,
    avbrytHref: PropTypes.string,
    handleSubmit: PropTypes.func,
};

function validate(values) {
    const feilmeldinger = {};

    if (!values.arbeidsgiver) {
        feilmeldinger.arbeidsgiver = 'Velg arbeidsgiver';
    }

    return feilmeldinger;
}

export default reduxForm({
    form: OPPFOLGINGSKJEMANAVN,
    validate,
})(ArbeidsgiverSkjema);