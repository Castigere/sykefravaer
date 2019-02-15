import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { harOverlappendePerioder } from '../../../utils/periodeUtils';
import Periodeliste from './Periodeliste';

const Periodevelger = ({ name, spoersmal, tidligsteFom, senesteTom, Overskrift = 'h3', initiellDato }) => {
    return (<FieldArray
        validate={(value) => {
            return harOverlappendePerioder(value)
                ? 'Du kan ikke legge inn perioder som overlapper med hverandre'
                : undefined;
        }}
        Overskrift={Overskrift}
        component={Periodeliste}
        name={name}
        namePrefix={name}
        spoersmal={spoersmal}
        tidligsteFom={tidligsteFom}
        senesteTom={senesteTom}
        initiellDato={initiellDato}
    />);
};

Periodevelger.propTypes = {
    name: PropTypes.string,
    spoersmal: PropTypes.string,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
    initiellDato: PropTypes.instanceOf(Date),
    Overskrift: PropTypes.string,
};

export default Periodevelger;
