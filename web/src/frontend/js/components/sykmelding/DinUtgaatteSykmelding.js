import React from 'react';
import { Utvidbar, getLedetekst, DineSykmeldingOpplysninger } from 'digisyfo-npm';
import SykmeldingStatuspanel from '../sykmeldingstatuspanel/SykmeldingStatuspanel';
import { sykmelding as sykmeldingPt } from '../../propTypes';

const DinUtgaatteSykmelding = ({ sykmelding }) => {
    return (<div>
        <SykmeldingStatuspanel sykmelding={sykmelding} />
        <Utvidbar
            erApen
            tittel={getLedetekst('din-sykmelding.dine-opplysninger.tittel')}
            ikon="svg/doctor-2.svg"
            ikonHover="svg/doctor-2_hover.svg"
            ikonAltTekst="Lege"
            className="blokk"
            variant="lysebla">
            <DineSykmeldingOpplysninger sykmelding={sykmelding} />
        </Utvidbar>
    </div>);
};

DinUtgaatteSykmelding.propTypes = {
    sykmelding: sykmeldingPt,
};

export default DinUtgaatteSykmelding;
