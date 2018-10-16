import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { fieldPropTypes } from '../../propTypes';
import Feilmelding from './Feilmelding';

const TekstfeltMedEnhet = ({ label, id, input, meta }) => {
    const className = cn('skjemaelement__input input--xs', {
        'skjemaelement__input--harFeil': meta.touched && meta.error,
    });
    return (<div className="skjemaelement">
        <div className="medEnhet">
            <input autoComplete="off" id={id} type="text" value={input.value} className={className} {...input} />
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