import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { getLedetekst, getHtmlLedetekst, Hjelpetekst } from 'digisyfo-npm';
import Feilomrade from '../../skjema/Feilomrade';
import SporsmalMedTillegg from '../../skjema/SporsmalMedTillegg';
import { Radioknapp } from '../../skjema/Radioknapper';
import { JA, NEI, VET_IKKE } from '../../../enums/forskutterersvar';

export const ForskuttererSporsmal = ({ input, meta }) => {
    return (<Feilomrade {...meta} id="arbeidsgiverForskutterer">
        <div className="medHjelpetekst">
            <h3 className="skjema__sporsmal">{getLedetekst('sykepengesoknad.forskutterer-arbeidsgiver.sporsmal')}</h3>
            <Hjelpetekst
                tittel={getLedetekst('sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tittel')}
                tekst={getLedetekst('sykepengesoknad.forskutterer-arbeidsgiver.hjelpetekst.tekst')} />
        </div>
        {
            [JA, NEI, VET_IKKE].map((alternativ, index) => {
                return (<Radioknapp
                    key={index}
                    value={alternativ}
                    label={getLedetekst(`sykepengesoknad.forskutterer-arbeidsgiver.svar.${alternativ}`)}
                    id={`arbeidsgiverForskutterer-${alternativ}`}
                    input={input} />);
            })
        }
    </Feilomrade>);
};

ForskuttererSporsmal.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    arbeidsgiver: PropTypes.object,
};

export const RendreForskuttererArbeidsgiver = (props) => {
    const Sporsmal = <ForskuttererSporsmal {...props} />;
    return (<SporsmalMedTillegg className="hovedsporsmal blokk" {...props} Sporsmal={Sporsmal} visTillegg={(_props) => {
        const input = _props.input;
        return input && (input.value === VET_IKKE || input.value === NEI || input.value === JA);
    }}>
        <div className="ekstrasporsmal ekstrasporsmal--sist"
            dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.forskutterer-arbeidsgiver.infotekst.${props.input.value}`)} />
    </SporsmalMedTillegg>);
};

RendreForskuttererArbeidsgiver.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.oneOf([JA, NEI, VET_IKKE, '']),
    }),
};

export const ForskuttererArbeidsgiver = () => {
    return (<Field
        component={RendreForskuttererArbeidsgiver}
        name="arbeidsgiverForskutterer" />);
};

export default ForskuttererArbeidsgiver;
