import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { getLedetekst, sykmelding as sykmeldingPt, Utvidbar } from '@navikt/digisyfo-npm';
import { Hovedknapp } from 'nav-frontend-knapper';
import Soknadskjema from '../../felleskomponenter/Soknadskjema';
import { skjemasvar as skjemasvarPt, soknadPt, soknadMetaReducerPt } from '../../../propTypes';
import Feilstripe from '../../../components/Feilstripe';
import Knapperad from '../../../components/skjema/Knapperad';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import Oppsummeringsvisning from '../../felleskomponenter/oppsummering/Oppsummeringsvisning';
import { BEKREFT_OPPLYSNINGER, BETALER_ARBEIDSGIVER, VAER_KLAR_OVER_AT } from '../../enums/tagtyper';
import OppsummeringUndertekst from '../../felleskomponenter/oppsummering/OppsummeringUndertekst';
import Sporsmal from '../../felleskomponenter/sporsmal/Sporsmal';
import SoknadMottaker from './SoknadMottaker';

const OppsummeringUtvidbar = ({ soknad }) => {
    const _soknad = {
        ...soknad,
        sporsmal: soknad.sporsmal.filter((s) => {
            return s.tag !== VAER_KLAR_OVER_AT;
        }),
    };
    return (<Utvidbar className="blokk js-soknad-oppsummering" tittel={getLedetekst('sykepengesoknad.oppsummering.tittel')} erApen={false}>
        <Oppsummeringsvisning soknad={_soknad} />
    </Utvidbar>);
};

OppsummeringUtvidbar.propTypes = {
    soknad: soknadPt,
};


export const hentSporsmalForOppsummering = (soknad) => {
    return soknad.sporsmal.filter((s) => {
        return s.tag === VAER_KLAR_OVER_AT
            || s.tag === BEKREFT_OPPLYSNINGER
            || s.tag === BETALER_ARBEIDSGIVER;
    });
};

export const SykepengesoknadArbeidstakerOppsummeringSkjema = (props) => {
    const {
        handleSubmit,
        soknad,
        skjemasvar,
        actions,
        sender,
        sendingFeilet,
        sykmelding,
    } = props;

    const populertSoknad = populerSoknadMedSvar(soknad, skjemasvar);

    const vaerKlarOverAtSpm = soknad.sporsmal.find((s) => {
        return s.tag === VAER_KLAR_OVER_AT;
    });
    const bekreftOpplysningerSpm = soknad.sporsmal.find((s) => {
        return s.tag === BEKREFT_OPPLYSNINGER;
    });
    const betalerArbeidsgiverSpm = soknad.sporsmal.find((s) => {
        return s.tag === BETALER_ARBEIDSGIVER;
    });

    const onSubmit = () => {
        actions.sendSoknad(populertSoknad);
    };
    return (<form className="soknadskjema" id="oppsummering-skjema" onSubmit={handleSubmit(onSubmit)}>
        {skjemasvar && <OppsummeringUtvidbar soknad={populertSoknad} />}
        <div className="panel blokk">
            <OppsummeringUndertekst {...vaerKlarOverAtSpm} />
        </div>
        {
            betalerArbeidsgiverSpm ?
                (<div className="panel blokk">
                    <Sporsmal
                        sporsmal={betalerArbeidsgiverSpm}
                        name={betalerArbeidsgiverSpm.tag}
                        soknad={soknad} />
                </div>)
                : null
        }
        <div className="bekreftet-container blokk">
            <Sporsmal
                sporsmal={bekreftOpplysningerSpm}
                name={bekreftOpplysningerSpm.tag}
                soknad={soknad} />
        </div>
        {!betalerArbeidsgiverSpm && <SoknadMottaker soknad={soknad} skjemasvar={skjemasvar} mottakernavn={sykmelding.mottakendeArbeidsgiver.navn} />}
        <Feilstripe vis={sendingFeilet} />
        <Knapperad variant="knapperad--forrigeNeste">
            <Link
                to={`${process.env.REACT_APP_CONTEXT_ROOT}/soknader/${soknad.id}/aktiviteter-i-sykmeldingsperioden/`}
                className="knapp">{getLedetekst('sykepengesoknad.tilbake')}</Link>
            <Hovedknapp className="js-send" spinner={sender}>{getLedetekst('sykepengesoknad.send')}</Hovedknapp>
        </Knapperad>
    </form>);
};

SykepengesoknadArbeidstakerOppsummeringSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    soknad: soknadPt,
    skjemasvar: skjemasvarPt,
    actions: PropTypes.shape({
        sendSoknad: PropTypes.func,
    }),
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    sykmelding: sykmeldingPt,
};

const Oppsummering = (props) => {
    const { sykmelding, soknad, handleSubmit, skjemasvar, actions, sendingFeilet, sender, soknadMeta } = props;
    return (<Soknadskjema
        aktivtSteg="4"
        sykmelding={sykmelding}
        soknad={soknad}>
        <SykepengesoknadArbeidstakerOppsummeringSkjema
            soknad={soknad}
            sykmelding={sykmelding}
            handleSubmit={handleSubmit}
            skjemasvar={skjemasvar}
            sendingFeilet={sendingFeilet || soknadMeta.hentingFeilet}
            sender={sender}
            actions={actions} />
    </Soknadskjema>);
};

Oppsummering.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
    handleSubmit: PropTypes.func,
    skjemasvar: skjemasvarPt,
    actions: PropTypes.shape({
        sendSoknad: PropTypes.func,
        utfyllingStartet: PropTypes.func,
    }),
    sendingFeilet: PropTypes.bool,
    sender: PropTypes.bool,
    soknadMeta: soknadMetaReducerPt,
};

export default Oppsummering;