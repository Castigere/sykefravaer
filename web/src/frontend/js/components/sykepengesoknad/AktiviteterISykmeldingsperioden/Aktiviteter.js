import React from 'react';
import PropTypes from 'prop-types';
import { Fields } from 'redux-form';
import { toDatePrettyPrint, getLedetekst, Hjelpetekst } from 'digisyfo-npm';
import JaEllerNei from '../JaEllerNei';
import AngiTid from './AngiTid';
import { soknadaktivitet } from '../../../propTypes';

export const Aktivitet = ({ field, index, arbeidsgiver, autofill, untouch }) => {
    const ledetekstPrefix = field.grad === 100 ? 'sykepengesoknad.aktiviteter.ugradert' : 'sykepengesoknad.aktiviteter.gradert';
    const tomDato = field.periode.tom;
    const hjelpetekst = field.grad !== 100 ? (<Hjelpetekst
        tittel={getLedetekst('sykepengesoknad.aktiviteter.gradert.hjelpetekst.tittel')}
        tekst={getLedetekst('sykepengesoknad.aktiviteter.gradert.hjelpetekst.tekst')} />) : null;

    return (<JaEllerNei
        name={`aktiviteter[${index}].jobbetMerEnnPlanlagt`}
        spoersmal={getLedetekst(`${ledetekstPrefix}.spoersmal-2`, {
            '%FOM%': toDatePrettyPrint(field.periode.fom),
            '%TOM%': toDatePrettyPrint(tomDato),
            '%ARBEIDSGIVER%': arbeidsgiver,
            '%ARBEIDSGRAD%': 100 - field.grad,
        })}
        hjelpetekst={hjelpetekst}>
        <div>
            <Fields
                autofill={autofill}
                untouch={untouch}
                component={AngiTid}
                aktivitetIndex={index}
                arbeidsgiver={arbeidsgiver}
                periode={field.periode}
                names={[
                    `aktiviteter[${index}].avvik.arbeidsgrad`,
                    `aktiviteter[${index}].avvik.timer`,
                    `aktiviteter[${index}].avvik.arbeidstimerNormalUke`,
                    `aktiviteter[${index}].avvik.enhet`,
                    `aktiviteter[${index}].avvik.beregnetArbeidsgrad`,
                ]} />
        </div>
    </JaEllerNei>);
};

Aktivitet.propTypes = {
    field: soknadaktivitet,
    index: PropTypes.number,
    arbeidsgiver: PropTypes.string,
    autofill: PropTypes.func,
    untouch: PropTypes.func,
};

const Aktiviteter = ({ fields, arbeidsgiver, autofill, untouch }) => {
    return (<div>
        {
            fields.map((field, index) => {
                return (<Aktivitet
                    field={field}
                    index={index}
                    key={index}
                    arbeidsgiver={arbeidsgiver}
                    autofill={autofill}
                    untouch={untouch} />);
            })
        }
    </div>);
};

Aktiviteter.propTypes = {
    fields: PropTypes.arrayOf(soknadaktivitet),
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    arbeidsgiver: PropTypes.string,
};

export default Aktiviteter;
