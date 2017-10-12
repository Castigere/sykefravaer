import React from 'react';
import PropTypes from 'prop-types';
import { ArbeidsgiversSykmeldingOpplysninger, Utvidbar } from 'digisyfo-npm';
import { sykmelding as sykmeldingPt } from '../../propTypes';

const ArbeidsgiversSykmelding = ({ sykmelding, Overskrift = 'h2', erApen = false }) => {
    return (<Utvidbar
        tittel="Dette får arbeidsgiveren din se"
        ikon="svg/arbeidsgiver.svg"
        ikonHover="svg/arbeidsgiver--hover.svg"
        ikonAltTekst="Arbeidsgiver"
        erApen={erApen}
        variant="lilla"
        Overskrift={Overskrift}>
        <ArbeidsgiversSykmeldingOpplysninger sykmelding={sykmelding} />
    </Utvidbar>);
};

ArbeidsgiversSykmelding.propTypes = {
    sykmelding: sykmeldingPt,
    Overskrift: PropTypes.string,
    erApen: PropTypes.bool,
};

export default ArbeidsgiversSykmelding;
