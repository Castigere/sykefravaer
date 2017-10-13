import React from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from '../../propTypes';
import Feilmelding from './Feilmelding';

const TekstfeltMedEnhet = ({ label, id, input, meta }) => {
    return (<div className="skjema__input">
        <div className="medEnhet">
            <input autoComplete="off" id={id} type="text" value={input.value} className={`${meta.touched && meta.error ? 'input--xs input--feil' : 'input--xs'}`} {...input} />
            <label htmlFor={id} className="medEnhet__enhet">{label}</label>
        </div>
        <Feilmelding {...meta} />
    </div>);
};

TekstfeltMedEnhet.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
};

export default TekstfeltMedEnhet;
