import React from 'react';
import { getLedetekst } from 'digisyfo-npm';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Radioknapper from '../skjema/Radioknapper';
import SporsmalMedTillegg from '../skjema/SporsmalMedTillegg';
import { childEllerChildren, fieldPropTypes, sporsmal as sporsmalPt } from '../../propTypes';
import { formaterEnkeltverdi, genererParseForEnkeltverdi } from './fieldUtils';
import { JA, NEI } from '../../enums/svarEnums';
import SporsmalBjorn from './SporsmalBjorn';
import { getOnChange } from '../../utils/soknad-felles/getOnChange';

const jaEllerNeiAlternativer = [JA, NEI];

export const JaEllerNeiRadioknapper = (props) => {
    return (<Radioknapper {...props} name={props.input.name} spoersmal={props.sporsmalstekst}>
        {
            jaEllerNeiAlternativer
                .map((alternativ, index) => {
                    return (<input
                        value={alternativ}
                        label={getLedetekst(`soknad.${alternativ.toLowerCase()}`)}
                        key={index} />);
                })
        }
    </Radioknapper>);
};

JaEllerNeiRadioknapper.propTypes = {
    input: fieldPropTypes.input,
    intro: PropTypes.string,
    sporsmalstekst: PropTypes.string,
};

export const RendreJaEllerNei = (props) => {
    const classNames = props.hovedsporsmal ? 'hovedsporsmal blokk--xs' : null;
    const classNamesTilleggssporsmal = props.hovedsporsmal ? 'hovedsporsmal__tilleggssporsmal' : null;
    const Sporsmal = <JaEllerNeiRadioknapper {...props} />;
    if (props.undersporsmal.length === 0) {
        return Sporsmal;
    }
    return (<SporsmalMedTillegg
        {...props}
        Sporsmal={Sporsmal}
        className={classNames}
        visTillegg={(_props) => {
            return _props.input.value === _props.kriterieForVisningAvUndersporsmal;
        }}>
        <div className={classNamesTilleggssporsmal}>{props.children}</div>
    </SporsmalMedTillegg>);
};

RendreJaEllerNei.propTypes = {
    children: childEllerChildren,
    undersporsmal: PropTypes.arrayOf(sporsmalPt),
    hovedsporsmal: PropTypes.bool,
};

const JaEllerNei = (props) => {
    return ([
        <Field
            onChange={getOnChange(props)}
            key={`${props.id}-field`}
            format={formaterEnkeltverdi}
            parse={genererParseForEnkeltverdi(props.id)}
            component={RendreJaEllerNei}
            {...props} />,
        <SporsmalBjorn
            key={`${props.id}-sporsmalbjorn`}
            tag={props.tag} />]);
};

JaEllerNei.propTypes = {
    id: PropTypes.string,
};

export default JaEllerNei;