import React from 'react';
import { Varselstripe, SykmeldingNokkelOpplysning } from 'digisyfo-npm';
import { toDatePrettyPrint, getLedetekst, Hjelpetekst } from 'digisyfo-npm';
import { SENDT, TIL_SENDING } from '../../enums/sykepengesoknadstatuser';
import { getSendtTilSuffix } from './Kvittering';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';

const getStatusTittel = (sykepengesoknad) => {
    switch (sykepengesoknad.status) {
        case SENDT: {
            return getLedetekst(`sykepengesoknad.status.SENDT${getSendtTilSuffix(sykepengesoknad)}`);
        }
        case TIL_SENDING: {
            return getLedetekst('sykepengesoknad.status.TIL_SENDING');
        }
        default: {
            return 'Ukjent status';
        }
    }
};

export const tilSendingHjelpetekst = () => {
    return (<Hjelpetekst
        tittel={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tittel')}
        tekst={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tekst')} />);
};

export const getNokkelopplysninger = (sykepengesoknad) => {
    return [[{
        tittel: getLedetekst('sykepengesoknad.oppsummering.status.label'),
        opplysning: getStatusTittel(sykepengesoknad),
        hjelpetekst: sykepengesoknad.status === TIL_SENDING ? tilSendingHjelpetekst() : null,
    }, {
        tittel: getLedetekst('sykepengesoknad.oppsummering.dato.label'),
        opplysning: toDatePrettyPrint(sykepengesoknad.sendtTilNAVDato || sykepengesoknad.sendtTilArbeidsgiverDato),
    }], [{
        tittel: getLedetekst('sykepengesoknad.oppsummering.arbeidsgiver.label'),
        opplysning: `${sykepengesoknad.arbeidsgiver.navn} (${sykepengesoknad.arbeidsgiver.orgnummer})`,
    }]];
};

export const Statuspanel = ({ sykepengesoknad }) => {
    const opplysninger = getNokkelopplysninger(sykepengesoknad);
    return (<div className="panel panel--komprimert blokk">
        <Varselstripe type="suksess">
            <div>
                {
                    opplysninger.map((opplysninger_, index1) => {
                        return (<div className="statusopplysninger" key={index1}>
                            {
                                opplysninger_.map(({ tittel, opplysning, hjelpetekst }, index2) => {
                                    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="h2" tittel={tittel} key={index2}>
                                        {
                                            hjelpetekst ?
                                                <div>
                                                    <span>{opplysning}</span>{hjelpetekst}
                                                </div>
                                                :
                                                <p>{opplysning}</p>
                                        }
                                    </SykmeldingNokkelOpplysning>);
                                })
                            }
                        </div>);
                    })
                }
            </div>
        </Varselstripe>
    </div>);
};

Statuspanel.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

export default Statuspanel;