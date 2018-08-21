import React from 'react';
import PropTypes from 'prop-types';
import { toDatePrettyPrint, getLedetekst, getHtmlLedetekst, sykepengesoknadstatuser } from 'digisyfo-npm';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';
import { erSendtTilBeggeMenIkkeSamtidig, getSendtTilSuffix } from '../../utils/sykepengesoknadUtils';
import { formaterOrgnr } from '../../utils';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../Statuspanel';

const { SENDT, TIL_SENDING, KORRIGERT } = sykepengesoknadstatuser;

const getParams = (sykepengesoknad) => {
    return {
        '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver.navn,
        '%ORGNR%': formaterOrgnr(sykepengesoknad.arbeidsgiver.orgnummer),
        '%SENDTTILNAVDATO%': toDatePrettyPrint(sykepengesoknad.sendtTilNAVDato),
        '%SENDTTILARBEIDSGIVERDATO%': toDatePrettyPrint(sykepengesoknad.sendtTilArbeidsgiverDato),
    };
};

const getStatusTekst = (sykepengesoknad) => {
    const params = getParams(sykepengesoknad);
    switch (sykepengesoknad.status) {
        case SENDT: {
            return getLedetekst(`sykepengesoknad.status-2.SENDT${getSendtTilSuffix(sykepengesoknad)}`, params);
        }
        case TIL_SENDING: {
            return getLedetekst(`sykepengesoknad.status-2.TIL_SENDING${getSendtTilSuffix(sykepengesoknad)}`, params);
        }
        case KORRIGERT: {
            return getLedetekst('sykepengesoknad.status-2.KORRIGERT');
        }
        default: {
            return 'Ukjent status';
        }
    }
};

export const tilSendingHjelpetekst = () => {
    return (<Hjelpetekst>{getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tekst')}</Hjelpetekst>);
};

export const SykepengerInfo = ({ sykepengesoknad }) => {
    return (<StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.sykepengeinfo.tittel')}>
        <p dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.sykepengeinfo${getSendtTilSuffix(sykepengesoknad)}`)} />
    </StatusNokkelopplysning>);
};

SykepengerInfo.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const SendtLikt = ({ sykepengesoknad }) => {
    const tekst = getStatusTekst(sykepengesoknad);
    return (<Statusopplysninger>
        <StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.status-2.tittel')}>
            {
                sykepengesoknad.status === TIL_SENDING
                    ? (<div>
                        <span>{tekst}</span>{tilSendingHjelpetekst()}
                    </div>)
                    : <p>{tekst}</p>
            }
        </StatusNokkelopplysning>
        <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>);
};

SendtLikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const SendtUlikt = ({ sykepengesoknad }) => {
    const params = getParams(sykepengesoknad);
    return (<Statusopplysninger>
        <StatusNokkelopplysning tittel={getLedetekst('sykepengesoknad.status-2.tittel')}>
            <p>
                {getLedetekst('sykepengesoknad.status-2.SENDT.til-nav', params)}<br />
                {getLedetekst('sykepengesoknad.status-2.SENDT.til-arbeidsgiver', params)}
            </p>
        </StatusNokkelopplysning>
        <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>);
};

SendtUlikt.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
};

const Soknadstatuspanel = ({ sykepengesoknad, children }) => {
    return (<Statuspanel enKolonne>
        {
            erSendtTilBeggeMenIkkeSamtidig(sykepengesoknad)
                ? <SendtUlikt sykepengesoknad={sykepengesoknad} />
                : <SendtLikt sykepengesoknad={sykepengesoknad} />
        }
        {children}
    </Statuspanel>);
};

Soknadstatuspanel.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    children: PropTypes.node,
};

export default Soknadstatuspanel;
