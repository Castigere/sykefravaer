import React from 'react';
import PropTypes from 'prop-types';
import beregnSteg, { AKTIVITETER_I_SYKMELDINGSPERIODEN, FOER_DU_BEGYNNER, FRAVAER_OG_FRISKMELDING, KVITTERING, OPPSUMMERING } from '../../utils/soknad-felles/beregnSteg';
import NyFoerDuBegynnerArbeidstakerContainer from '../../containers/sykepengesoknad-arbeidstaker-ny/NyFoerDuBegynnerArbeidstakerContainer';
import NyFravaerOgFriskmeldingArbeidstakerContainer from '../../containers/sykepengesoknad-arbeidstaker-ny/NyFravaerOgFriskmeldingArbeidstakerContainer';
import NyAktiviteterISykmeldingsperiodenArbeidstakerContainer from '../../containers/sykepengesoknad-arbeidstaker-ny/NyAktiviteterISykmeldingsperiodenArbeidstakerContainer';
import NyOppsummeringArbeidstakerContainer from '../../containers/sykepengesoknad-arbeidstaker-ny/NyOppsummeringArbeidstakerContainer';
import SoknadKvitteringSjekker from '../soknad-felles/SoknadKvitteringSjekker';
import { soknad as soknadPt } from '../../propTypes';
import { KORRIGERT, NY, SENDT, UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import NySendtSoknadArbeidstaker from './NySendtSoknadArbeidstaker';
import Feilmelding from '../Feilmelding';

const NySoknadArbeidstakerSkjema = (props) => {
    const { sti } = props;
    const steg = beregnSteg(sti);
    switch (steg) {
        case FOER_DU_BEGYNNER: {
            return <NyFoerDuBegynnerArbeidstakerContainer {...props} />;
        }
        case FRAVAER_OG_FRISKMELDING: {
            return <NyFravaerOgFriskmeldingArbeidstakerContainer {...props} />;
        }
        case AKTIVITETER_I_SYKMELDINGSPERIODEN: {
            return <NyAktiviteterISykmeldingsperiodenArbeidstakerContainer {...props} />;
        }
        case OPPSUMMERING: {
            return <NyOppsummeringArbeidstakerContainer {...props} />;
        }
        case KVITTERING: {
            return <SoknadKvitteringSjekker soknad={props.soknad} />;
        }
        default: {
            return null;
        }
    }
};

NySoknadArbeidstakerSkjema.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

const NySoknadArbeidstaker = (props) => {
    const { soknad, sti } = props;
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return <NySoknadArbeidstakerSkjema {...props} />;
        }
        case SENDT:
        case KORRIGERT: {
            if (beregnSteg(sti) === KVITTERING) {
                return <SoknadKvitteringSjekker {...props} />;
            }
            return <NySendtSoknadArbeidstaker {...props} />;
        }
        default: {
            return <Feilmelding melding="Søknaden har ukjent status" />;
        }
    }
};

NySoknadArbeidstaker.propTypes = {
    sti: PropTypes.string,
    soknad: soknadPt,
};

export default NySoknadArbeidstaker;
