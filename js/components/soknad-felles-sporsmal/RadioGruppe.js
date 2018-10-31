import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Radioknapper from '../skjema/Radioknapper';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import Undersporsmalsliste from './Undersporsmalsliste';
import { getOnChange } from '../../utils/soknad-felles/getOnChange';
import { fieldPropTypes, sporsmal as sporsmalPt, svaralternativer as svaralternativerPt } from '../../propTypes';

const RadiogruppeComponent = ({ input, meta, sporsmalstekst, undersporsmal, svaralternativer, id }) => {
    return (<div>
        <Radioknapper input={input} meta={meta} spoersmal={sporsmalstekst} horisontal>
            {
                svaralternativer.map((svaralternativ) => {
                    return (<i
                        key={`${svaralternativ.verdi}_${id}`}
                        label={svaralternativ.svartekst}
                        value={svaralternativ.verdi} />);
                })
            }
        </Radioknapper>
        <Undersporsmalsliste undersporsmal={undersporsmal} parentValue={input.value} />
    </div>);
};

RadiogruppeComponent.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    sporsmalstekst: PropTypes.string,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    svaralternativer: svaralternativerPt,
    id: PropTypes.string,
};

const RadioGruppe = (props) => {
    const { id } = props;
    const parse = genererParseForEnkeltverdi(id);
    return (<Field
        onChange={getOnChange(props)}
        parse={parse}
        format={formaterEnkeltverdi}
        component={RadiogruppeComponent}
        {...props} />);
};

RadioGruppe.propTypes = {
    id: PropTypes.string,
};

export default RadioGruppe;
