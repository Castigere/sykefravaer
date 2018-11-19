import React from 'react';
import { getLedetekst } from 'digisyfo-npm';
import { Link } from 'react-router';
import KvitteringArbeidstakere from '../../components/sykepengesoknad-arbeidstaker-ny/Kvittering/Kvittering';
import KvitteringSelvstendige from '../../components/sykepengesoknad-selvstendig/Kvittering/Kvittering';
import { KORRIGERT, NY, SENDT, TIL_SENDING, UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import Feilmelding from '../../components/Feilmelding';
import { soknad as soknadPt } from '../../propTypes';
import Sidetopp from '../../components/Sidetopp';
import { SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';

const SoknadKvitteringSjekker = ({ soknad }) => {
    switch (soknad.status) {
        case NY:
        case UTKAST_TIL_KORRIGERING: {
            return (<div>
                <Sidetopp tittel={getLedetekst('sykepengesoknad.sidetittel')} />
                <Feilmelding tittel={getLedetekst('soknad.kvittering.ugyldig.ny.tittel')}>
                    <span>
                        {getLedetekst('soknad.kvittering.ugyldig.ny.melding')} <Link
                            className="lenke"
                            to={`/sykefravaer/soknader/${soknad.id}`}>{getLedetekst('soknad.kvittering.ugyldig.ny.lenke')}</Link>
                    </span>
                </Feilmelding>
            </div>);
        }
        case KORRIGERT:
        case SENDT:
        case TIL_SENDING: {
            return soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE
                ? <KvitteringSelvstendige />
                : <KvitteringArbeidstakere />;
        }
        default: {
            return <Feilmelding melding="feil status" />;
        }
    }
};

SoknadKvitteringSjekker.propTypes = {
    soknad: soknadPt,
};

export default SoknadKvitteringSjekker;
