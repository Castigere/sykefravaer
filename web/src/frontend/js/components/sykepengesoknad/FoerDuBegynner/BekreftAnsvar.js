import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import CheckboxSelvstendig from '../../skjema/CheckboxSelvstendig';
import { getLedetekst } from 'digisyfo-npm';

const BekreftAnsvar = ({ ledetekster }) => {
    const label = getLedetekst('sykepengesoknad.bekreft-ansvar.label', ledetekster);
    return (<div className="blokk">
        <p>{getLedetekst('sykepengesoknad.bekreft-ansvar.introtekst', ledetekster)}</p>
        <Field component={CheckboxSelvstendig} name="ansvarBekreftet" id="ansvarBekreftet" label={label} />
    </div>);
};

BekreftAnsvar.propTypes = {
    ledetekster: PropTypes.object,
};

export default BekreftAnsvar;
