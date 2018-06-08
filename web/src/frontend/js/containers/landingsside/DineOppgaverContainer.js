import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSvarsideModus } from 'moter-npm';
import { getLedetekst, log, sykepengesoknadstatuser, sykmeldingstatuser } from 'digisyfo-npm';
import {
    hentOppfolgingsdialogerAt as hentOppfolgingsdialoger,
    proptypes as oppfolgingProptypes,
    henterEllerHarHentetOppfolgingsdialoger,
} from 'oppfolgingsdialog-npm';
import { oppgaverOppfoelgingsdialoger } from '../../utils/oppfolgingsdialogUtils';
import { Vis } from '../../utils';
import { sykepengesoknad as sykepengesoknadPt, sykmelding as sykmeldingPt } from '../../propTypes';
import { erMotePassert } from '../../utils/moteUtils';
import { hentDineSykmeldinger } from '../../actions/dineSykmeldinger_actions';
import { hentHendelser } from '../../actions/hendelser_actions';
import { getAktivitetskravvisning, NYTT_AKTIVITETSKRAVVARSEL } from '../aktivitetskrav/AktivitetskravvarselContainer';
import IllustrertInnhold from '../../components/IllustrertInnhold';

const Li = ({ tekst, url }) => {
    return (<li>
        <Link to={url}>{tekst}</Link>
    </li>);
};

Li.propTypes = {
    tekst: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export const NySykmelding = ({ sykmeldinger }) => {
    const url = sykmeldinger.length === 1 ? `/sykefravaer/sykmeldinger/${sykmeldinger[0].id}` : '/sykefravaer/sykmeldinger';
    const tekst = sykmeldinger.length === 1 ? getLedetekst('dine-oppgaver.sykmeldinger.en-sykmelding') : getLedetekst('dine-oppgaver.sykmeldinger.flere-sykmeldinger', {
        '%ANTALL%': sykmeldinger.length.toString(),
    });
    return (<Li url={url} tekst={tekst} />);
};

NySykmelding.propTypes = {
    sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export const NySykepengesoknad = ({ sykepengesoknader }) => {
    const url = sykepengesoknader.length === 1 ? `/sykefravaer/soknader/${sykepengesoknader[0].id}` : '/sykefravaer/soknader';
    const tekst = sykepengesoknader.length === 1 ? getLedetekst('dine-oppgaver.sykepengesoknader.en-soknad') : getLedetekst('dine-oppgaver.sykepengesoknader.flere-soknader', {
        '%ANTALL%': sykepengesoknader.length.toString(),
    });
    return (<Li url={url} tekst={tekst} />);
};

export const NyttAktivitetskravvarsel = () => {
    return (<Li url="/sykefravaer/aktivitetsplikt/" tekst={getLedetekst('dine-oppgaver.aktivitetskrav')} />);
};

NySykepengesoknad.propTypes = {
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
};

const nyePlanerTekst = (antall) => {
    return antall === 1 ? getLedetekst('dine-oppgaver.oppfoelgingsdialog.sykmeldt.nyeplaner.entall') :
        getLedetekst('dine-oppgaver.oppfoelgingsdialog.sykmeldt.nyeplaner.flertall', {
            '%ANTALL%': antall,
        });
};

const avventendeGodkjenningerTekst = (antall) => {
    return antall === 1 ? getLedetekst('dine-oppgaver.oppfoelgingsdialog.avventendegodkjenninger.entall') :
        getLedetekst('dine-oppgaver.oppfoelgingsdialog.avventendegodkjenninger.flertall', {
            '%ANTALL%': antall,
        });
};

const RendreOppgaver = ({ sykmeldinger = [], sykepengesoknader = [], visOppgaver, mote, avventendeGodkjenninger, nyePlaner, visAktivitetskrav }) => {
    if (!visOppgaver) {
        return null;
    }

    return (<div className="landingspanel dineOppgaver">
        <IllustrertInnhold ikon="/sykefravaer/img/svg/landingsside/oppgaver.svg" ikonAlt="Oppgaver">
            <div>
                <h2 className="dineOppgaver__tittel js-tittel">{getLedetekst('dine-oppgaver.tittel')}</h2>
                <ul className="inngangsliste">
                    <Vis hvis={sykmeldinger.length > 0}>
                        <NySykmelding sykmeldinger={sykmeldinger} />
                    </Vis>
                    <Vis hvis={sykepengesoknader.length > 0}>
                        <NySykepengesoknad sykepengesoknader={sykepengesoknader} />
                    </Vis>
                    <Vis hvis={mote !== null}>
                        <Li url="/sykefravaer/dialogmote" tekst={getLedetekst('dine-oppgaver.mote.svar')} />
                    </Vis>
                    <Vis hvis={avventendeGodkjenninger.length > 0}>
                        <Li url="/sykefravaer/oppfolgingsplaner" tekst={avventendeGodkjenningerTekst(avventendeGodkjenninger.length)} />
                    </Vis>
                    <Vis hvis={nyePlaner.length > 0}>
                        <Li url="/sykefravaer/oppfolgingsplaner" tekst={nyePlanerTekst(nyePlaner.length)} />
                    </Vis>
                    <Vis hvis={visAktivitetskrav}>
                        <NyttAktivitetskravvarsel />
                    </Vis>
                </ul>
            </div>
        </IllustrertInnhold>
    </div>);
};

RendreOppgaver.propTypes = {
    avventendeGodkjenninger: PropTypes.arrayOf(oppfolgingProptypes.oppfolgingsdialogPt),
    nyePlaner: PropTypes.arrayOf(oppfolgingProptypes.oppfolgingsdialogPt),
    sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    visOppgaver: PropTypes.bool,
    mote: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    visAktivitetskrav: PropTypes.bool,
};

export class DineOppgaver extends Component {
    componentWillMount() {
        const { sykmeldingerHentet, sykmeldingerHentingFeilet, hendelserHentet, hentingFeiletHendelser, oppfolgingsdialogerHentet, visOppgaver } = this.props;
        if (!sykmeldingerHentet && !sykmeldingerHentingFeilet) {
            this.props.hentDineSykmeldinger();
        }
        if (!hendelserHentet && !hentingFeiletHendelser) {
            this.props.hentHendelser();
        }
        if (!oppfolgingsdialogerHentet) {
            this.props.hentOppfolgingsdialoger();
        }
    }

    render() {
        return <RendreOppgaver {...this.props} />;
    }
}

DineOppgaver.propTypes = {
    sykmeldingerHentet: PropTypes.bool,
    sykmeldingerHentingFeilet: PropTypes.bool,
    hentDineSykmeldinger: PropTypes.func,
    hentOppfolgingsdialoger: PropTypes.func,
    hentHendelser: PropTypes.func,
    hentingFeiletHendelser: PropTypes.bool,
    hendelserHentet: PropTypes.bool,
    oppfolgingsdialogerHentet: PropTypes.bool,
    visOppgaver: PropTypes.bool,
};

export const mapStateToProps = (state) => {
    const sykmeldinger = state.dineSykmeldinger.data.filter((s) => {
        return s.status === sykmeldingstatuser.NY;
    });
    const sykepengesoknader = state.sykepengesoknader.data.filter((s) => {
        return s.status === sykepengesoknadstatuser.NY;
    });

    const mote = state.mote.data;
    let moteRes = null;
    if (mote && !erMotePassert(mote)) {
        if (getSvarsideModus(mote) === 'SKJEMA') {
            moteRes = 'TRENGER_SVAR';
        }
    }
    const _oppgaverOppfoelgingsdialoger = oppgaverOppfoelgingsdialoger(state.oppfolgingsdialoger.data, state.dineSykmeldinger.data);
    const visAktivitetskrav = getAktivitetskravvisning(state.hendelser.data) === NYTT_AKTIVITETSKRAVVARSEL;
    const visOppgaver = sykmeldinger.length > 0 || sykepengesoknader.length > 0 || moteRes !== null ||
        _oppgaverOppfoelgingsdialoger.avventendeGodkjenninger.length > 0 || _oppgaverOppfoelgingsdialoger.nyePlaner.length > 0 || visAktivitetskrav;

    return {
        sykmeldingerHentet: state.dineSykmeldinger.hentet === true,
        sykmeldinger,
        sykmeldingerHentingFeilet: state.dineSykmeldinger.hentingFeilet,
        oppfolgingsdialogerHentet: henterEllerHarHentetOppfolgingsdialoger(state.oppfolgingsdialoger)
        || state.oppfolgingsdialoger.hentingFeilet,
        sykepengesoknader,
        visOppgaver,
        mote: moteRes,
        avventendeGodkjenninger: _oppgaverOppfoelgingsdialoger.avventendeGodkjenninger,
        nyePlaner: _oppgaverOppfoelgingsdialoger.nyePlaner,
        hentingFeiletHendelser: state.hendelser.hentingFeilet,
        hendelserHentet: state.hendelser.hentet,
        visAktivitetskrav,
    };
};

const DineOppgaverContainer = connect(mapStateToProps, {
    hentDineSykmeldinger, hentHendelser, hentOppfolgingsdialoger,
})(DineOppgaver);

export default DineOppgaverContainer;
