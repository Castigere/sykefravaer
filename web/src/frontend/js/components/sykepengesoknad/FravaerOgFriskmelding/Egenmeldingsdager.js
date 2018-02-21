import React from 'react';
import { Hjelpetekst, toDatePrettyPrint, getLedetekst, getTidligsteStartdatoSykeforloep, getEgenmeldingsdagerSporsmal } from 'digisyfo-npm';
import JaEllerNei from '../JaEllerNei';
import Periodevelger from '../../skjema/Periodevelger';
import { sykepengesoknad as sykepengesoknadPt } from '../../../propTypes';

const EgenmeldingsDager = ({ sykepengesoknad }) => {
    const startSykeforloep = getTidligsteStartdatoSykeforloep(sykepengesoknad);
    const senesteTom = new Date(startSykeforloep);
    senesteTom.setDate(startSykeforloep.getDate() - 1);
    const tidligsteFom = new Date(senesteTom);
    tidligsteFom.setMonth(senesteTom.getMonth() - 6);

    const hjelpetekst = (<Hjelpetekst
        id="egenmeldingsdager-hjelpetekst"
        tittel={getLedetekst('sykepengesoknad.egenmeldingsdager.hjelpetekst.tittel')}
        tekst={getLedetekst('sykepengesoknad.egenmeldingsdager.hjelpetekst.tekst', {
            '%DATO%': toDatePrettyPrint(startSykeforloep),
        })} />);

    return (
        <JaEllerNei
            spoersmal={getEgenmeldingsdagerSporsmal(sykepengesoknad)}
            name="bruktEgenmeldingsdagerFoerLegemeldtFravaer"
            hjelpetekst={hjelpetekst}>
            <Periodevelger
                name="egenmeldingsperioder"
                spoersmal={getLedetekst('sykepengesoknad.egenmeldingsdager.dato.sporsmal-2', {
                    '%DATO%': toDatePrettyPrint(startSykeforloep),
                })}
                tidligsteFom={tidligsteFom}
                senesteTom={senesteTom} />
        </JaEllerNei>);
};

EgenmeldingsDager.propTypes = {
    sykepengesoknad: sykepengesoknadPt.isRequired,
};

export default EgenmeldingsDager;
