import React from 'react';
import {
    getLedetekst,
    sykmelding as sykmeldingPt,
    tilLesbarDatoMedArstall,
    SykmeldingUtdrag,
    Utvidbar,
} from 'digisyfo-npm';
import { connect } from 'react-redux';
import Oppsummeringsvisning from '../soknad-felles-oppsummering/Oppsummeringsvisning';
import { soknad as soknadPt } from '../../propTypes';
import Soknadtopp from '../soknad-felles/Soknadtopp';
import { finnSykmelding } from '../../utils/soknad-felles/soknadSetup';
import { VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../Statuspanel';

export const SendtSoknadArbeidstakerStatuspanel = ({ soknad }) => {
    return (<Statuspanel>
        <Statusopplysninger>
            <StatusNokkelopplysning tittel={getLedetekst('statuspanel.status')}>
                <p>{soknad.status}</p>
            </StatusNokkelopplysning>
            <StatusNokkelopplysning tittel={getLedetekst('statuspanel.dato.innsendt')}>
                <p>{tilLesbarDatoMedArstall(soknad.innsendtDato)}</p>
            </StatusNokkelopplysning>
        </Statusopplysninger>
    </Statuspanel>);
};

SendtSoknadArbeidstakerStatuspanel.propTypes = {
    soknad: soknadPt,
};

const NySendtSoknadArbeidstaker = ({ sykmelding, soknad }) => {
    return (<div>
        <Soknadtopp soknad={soknad} />
        <SendtSoknadArbeidstakerStatuspanel soknad={soknad} />
        {sykmelding && <SykmeldingUtdrag sykmelding={sykmelding} />}
        <Utvidbar
            tittel={getLedetekst('sykepengesoknad.oppsummering.tittel')}
            className="blokk js-soknad-oppsummering"
            erApen>
            <Oppsummeringsvisning
                soknad={{
                    ...soknad,
                    sporsmal: soknad.sporsmal.filter((s) => {
                        return s.tag !== VAER_KLAR_OVER_AT;
                    }),
                }} />
        </Utvidbar>
        <div className="panel js-vaer-klar-over-at">
            <Oppsummeringsvisning
                soknad={{
                    ...soknad,
                    sporsmal: soknad.sporsmal.filter((s) => {
                        return s.tag === VAER_KLAR_OVER_AT;
                    }),
                }} />
        </div>
    </div>);
};

NySendtSoknadArbeidstaker.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
};

const mapStateToProps = (state, ownProps) => {
    return {
        sykmelding: finnSykmelding(state, ownProps),
    };
};

export default connect(mapStateToProps)(NySendtSoknadArbeidstaker);