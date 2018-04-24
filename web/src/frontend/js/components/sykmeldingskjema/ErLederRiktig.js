import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { getLedetekst, Hjelpetekst } from 'digisyfo-npm';
import Radioknapper from '../skjema/Radioknapper';
import { naermesteLeder as naermesteLederPt, fieldPropTypes } from '../../propTypes';

export const RendreErLederRiktig = ({ input, meta, naermesteLeder }) => {
    const alternativer = [{
        label: getLedetekst('radioknapp.ja'),
        value: false,
    }, {
        label: getLedetekst('radioknapp.nei'),
        value: true,
    }];

    const infoOmSykemeldingmottaker = (navn) => {
        return input.value === true
            ? <p>{getLedetekst('starte-sykmelding.bekreft-naermeste-leder.sporsmal.nei')}</p>
            : input.value === false
                ? (<p>
                    {getLedetekst('starte-sykmelding.bekreft-naermeste-leder.sporsmal.ja', {
                        '%NAERMESTELEDER%': navn,
                    })}
                </p>)
                : null;
    };

    const hjelpetekst = (<Hjelpetekst
        id="velg-beOmNyNaermesteLeder-hjelpetekst"
        tittel={getLedetekst('din-sykmelding.beOmNyNaermesteLeder.hjelpetekst.tittel')}
        tekst={getLedetekst('din-sykmelding.beOmNyNaermesteLeder.hjelpetekst.tekst')} />);

    return (<div className="hovedsporsmal__tilleggssporsmal">
        <Radioknapper
            input={input}
            meta={meta}
            spoersmal={getLedetekst('starte-sykmelding.bekreft-naermeste-leder.sporsmal.v2', {
                '%NAERMESTELEDER%': naermesteLeder.navn,
            })}
            hjelpetekst={hjelpetekst}>
            {
                alternativer.map((alternativ, index) => {
                    return <input {...alternativ} key={index} />;
                })
            }
        </Radioknapper>
        {infoOmSykemeldingmottaker(naermesteLeder.navn)}
    </div>);
};

RendreErLederRiktig.propTypes = {
    input: fieldPropTypes.input,
    meta: fieldPropTypes.meta,
    naermesteLeder: naermesteLederPt,
};

const ErLederRiktig = (props) => {
    return (<Field
        {...props}
        component={RendreErLederRiktig}
        name="beOmNyNaermesteLeder"
        parse={(value) => {
            if (value !== undefined) {
                return value === 'true';
            }
            return value;
        }} />);
};

ErLederRiktig.propTypes = {
    skjemaData: PropTypes.shape({}),
    naermesteLeder: naermesteLederPt,
};

export default ErLederRiktig;
