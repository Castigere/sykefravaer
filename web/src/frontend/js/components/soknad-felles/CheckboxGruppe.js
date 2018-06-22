import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import Sporsmalstekst from './Sporsmalstekst';
import Feilomrade from '../skjema/Feilomrade';
import Checkbox from './Checkbox';
import { sporsmal as sporsmalPt, fieldPropTypes } from '../../propTypes';
import Undertekst from './Undertekst';

const rendreCheckboxGruppe = ({ fields, meta }) => {
    return (<Feilomrade {...meta}>
        {
            fields.map((field) => {
                return <Checkbox {...field} name={field.tag} key={field.tag} />;
            })
        }
    </Feilomrade>);
};

rendreCheckboxGruppe.propTypes = {
    fields: PropTypes.arrayOf(sporsmalPt),
    meta: fieldPropTypes.meta,
};

const CheckboxGruppe = ({ sporsmalstekst, undertekst, name, undersporsmal }) => {
    return (<div>
        <Sporsmalstekst tekst={sporsmalstekst} />
        <Undertekst tekst={undertekst} />
        <FieldArray component={rendreCheckboxGruppe} name={name} fields={undersporsmal} />
    </div>);
};

CheckboxGruppe.propTypes = {
    sporsmalstekst: PropTypes.string,
    name: PropTypes.string,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    undertekst: PropTypes.string,
};

export default CheckboxGruppe;
