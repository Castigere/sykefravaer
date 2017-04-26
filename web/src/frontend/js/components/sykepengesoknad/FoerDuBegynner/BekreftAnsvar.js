import React from 'react';
import { Field } from 'redux-form';
import CheckboxSelvstendig from '../../skjema/CheckboxSelvstendig';
import { getLedetekst } from 'digisyfo-npm';

const BekreftAnsvar = () => {
    const label = getLedetekst('sykepengesoknad.bekreft-ansvar.label');
    return (<div className="blokk">
        <p>{getLedetekst('sykepengesoknad.bekreft-ansvar.introtekst')}</p>
        <Field component={CheckboxSelvstendig} name="ansvarBekreftet" id="ansvarBekreftet" label={label} />
    </div>);
};

export default BekreftAnsvar;
