import React, { PropTypes, Component } from 'react';
import { getContextRoot } from '../../routers/paths';
import Arbeidsoppgaver from './utfylling/Arbeidsoppgaver';
import ReleasetPlanAT from './releasetplan/ReleasetPlanAT';
import Tiltak from './utfylling/Tiltak';

import {
    NavigasjonsTopp,
    NavigasjonsBunn,
    AvvistPlanKvittering,
    BRUKERTYPE,
    Godkjenn,
    Godkjenninger,
    Samtykke,
} from 'oppfolgingsdialog-npm';

const inneholderGodkjenninger = (oppfolgingsdialog) => {
    return oppfolgingsdialog.godkjenninger.length > 0;
};

const inneholderGodkjentPlan = (oppfolgingsdialog) => {
    return oppfolgingsdialog.godkjentPlan;
};

const erAvvistAvArbeidstaker = (oppfolgingsdialog) => {
    return oppfolgingsdialog.godkjenninger.length === 1 && !oppfolgingsdialog.godkjenninger[0].godkjent && oppfolgingsdialog.arbeidstaker.aktoerId === oppfolgingsdialog.godkjenninger[0].godkjentAvAktoerId;
};

export class Oppfolgingsdialog extends Component {

    constructor() {
        super();

        this.state = {
            visSamtykke: false,
            visAvvisPlanKvittering: false,
            begrunnelse: null,
        };
        this.visAvvisPlanKvittering = this.visAvvisPlanKvittering.bind(this);
    }

    componentWillMount() {
        this.props.settAktivtSteg(1);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.godkjenner && nextProps.godkjent) {
            this.setState({
                visSamtykke: true,
            });
        } else {
            this.setState({
                visSamtykke: false,
            });
        }
    }

    visAvvisPlanKvittering(vis, begrunnelse) {
        this.setState({
            visAvvisPlanKvittering: vis,
            begrunnelse,
        });
    }

    render() {
        const {
            lagrerArbeidsoppgave,
            lagrerTiltak,
            lagretArbeidsoppgave,
            lagretTiltak,
            lagringFeiletArbeidsoppgave,
            lagringFeiletTiltak,
            sletterArbeidsoppgave,
            sletterTiltak,
            slettetArbeidsoppgave,
            slettetTiltak,
            slettingFeiletArbeidsoppgave,
            slettingFeiletTiltak,
            oppfolgingsdialogerHentet,
            oppfolgingsdialog,
            oppfolgingsdialogId,
            ledetekster,
            settAktivtSteg,
            avvisDialog,
            dokument,
            godkjennDialog,
            hentPdfurler,
            giSamtykke,
            navigasjontoggles,
            toggleAvvisPlan,
            nullstillGodkjenning,
            lagreTiltak,
            slettTiltak,
            lagreArbeidsoppgave,
            slettArbeidsoppgave,
        } = this.props;

        let panel;
        let disableNavigation = false;
        if (this.state.visAvvisPlanKvittering) {
            disableNavigation = true;
            panel = (<AvvistPlanKvittering
                ledetekster={ledetekster}
                rootUrl={`${window.APP_SETTINGS.APP_ROOT}`}
                begrunnelse={this.state.begrunnelse}
                visAvvisPlanKvittering={this.visAvvisPlanKvittering}
            />);
        } else if (this.state.visSamtykke && oppfolgingsdialog.arbeidstaker.samtykke === null) {
            disableNavigation = true;
            panel = (<Samtykke
                sendSamtykke={giSamtykke}
                oppfolgingsdialog={oppfolgingsdialog}
                ledetekster={ledetekster}
                rootUrl={`${getContextRoot()}`}
            />);
        } else if (inneholderGodkjenninger(oppfolgingsdialog) && !erAvvistAvArbeidstaker(oppfolgingsdialog)) {
            disableNavigation = true;
            panel = (<Godkjenninger
                avvisDialog={avvisDialog}
                oppfolgingsdialog={oppfolgingsdialog}
                godkjennPlan={godkjennDialog}
                ledetekster={ledetekster}
                toggleAvvisPlan={toggleAvvisPlan}
                visAvvisPlanKvittering={this.visAvvisPlanKvittering}
                nullstillGodkjenning={nullstillGodkjenning}
                brukerType={BRUKERTYPE.ARBEIDSTAKER}
                rootUrl={`${getContextRoot()}`}
            />);
        } else if (inneholderGodkjentPlan(oppfolgingsdialog)) {
            disableNavigation = true;
            panel = (<ReleasetPlanAT
                ledetekster={ledetekster}
                oppfolgingsdialog={oppfolgingsdialog}
                hentPdfurler={hentPdfurler}
                dokument={dokument}
                giSamtykke={giSamtykke}
            />);
        } else {
            (() => {
                if (navigasjontoggles.steg === 1) {
                    panel = (<Arbeidsoppgaver
                        lagrer={lagrerArbeidsoppgave}
                        lagret={lagretArbeidsoppgave}
                        sletter={sletterArbeidsoppgave}
                        slettet={slettetArbeidsoppgave}
                        lagringFeilet={lagringFeiletArbeidsoppgave}
                        slettingFeilet={slettingFeiletArbeidsoppgave}
                        oppfolgingsdialogerHentet={oppfolgingsdialogerHentet}
                        ledetekster={ledetekster}
                        oppfolgingsdialog={oppfolgingsdialog}
                        oppfolgingsdialogId={oppfolgingsdialogId}
                        lagreArbeidsoppgave={lagreArbeidsoppgave}
                        slettArbeidsoppgave={slettArbeidsoppgave}
                    />);
                } else if (navigasjontoggles.steg === 2) {
                    panel = (<Tiltak
                        lagrer={lagrerTiltak}
                        lagret={lagretTiltak}
                        sletter={sletterTiltak}
                        slettet={slettetTiltak}
                        lagringFeilet={lagringFeiletTiltak}
                        slettingFeilet={slettingFeiletTiltak}
                        oppfolgingsdialogerHentet={oppfolgingsdialogerHentet}
                        ledetekster={ledetekster}
                        oppfolgingsdialog={oppfolgingsdialog}
                        oppfolgingsdialogId={oppfolgingsdialogId}
                        lagreTiltak={lagreTiltak}
                        slettTiltak={slettTiltak}
                    />);
                } else {
                    panel = (<Godkjenn
                        ledetekster={ledetekster}
                        oppfolgingsdialog={oppfolgingsdialog}
                        settAktivtSteg={settAktivtSteg}
                        godkjennPlan={godkjennDialog}
                        brukerType={BRUKERTYPE.ARBEIDSTAKER}
                        rootUrl={`${getContextRoot()}`}
                    />);
                }
            })();
        }

        return (
            <div>
                <NavigasjonsTopp
                    ledetekster={ledetekster}
                    disabled={disableNavigation}
                    navn={oppfolgingsdialog.virksomhetsnavn}
                    settAktivtSteg={settAktivtSteg}
                    steg={navigasjontoggles.steg}
                />
                <div id="oppfolgingsdialogpanel">
                    { panel }
                </div>
                <NavigasjonsBunn
                    disabled={disableNavigation}
                    settAktivtSteg={settAktivtSteg}
                    steg={navigasjontoggles.steg}
                />
            </div>
        );
    }
}

Oppfolgingsdialog.propTypes = {
    godkjenner: PropTypes.bool,
    godkjent: PropTypes.bool,
    lagrerArbeidsoppgave: PropTypes.bool,
    lagrerTiltak: PropTypes.bool,
    lagretArbeidsoppgave: PropTypes.bool,
    lagretTiltak: PropTypes.bool,
    lagringFeiletArbeidsoppgave: PropTypes.bool,
    lagringFeiletTiltak: PropTypes.bool,
    sletterArbeidsoppgave: PropTypes.bool,
    sletterTiltak: PropTypes.bool,
    slettetArbeidsoppgave: PropTypes.bool,
    slettetTiltak: PropTypes.bool,
    slettingFeiletArbeidsoppgave: PropTypes.bool,
    slettingFeiletTiltak: PropTypes.bool,
    oppfolgingsdialogerHentet: PropTypes.bool,
    oppfolgingsdialog: PropTypes.object,
    oppfolgingsdialogId: PropTypes.string,
    steg: PropTypes.number,
    ledetekster: PropTypes.object,
    godkjennDialog: PropTypes.func,
    nullstillGodkjenning: PropTypes.func,
    toggleAvvisPlan: PropTypes.func,
    hentPdfurler: PropTypes.func,
    giSamtykke: PropTypes.func,
    lagreArbeidsoppgave: PropTypes.func,
    slettArbeidsoppgave: PropTypes.func,
    lagreTiltak: PropTypes.func,
    slettTiltak: PropTypes.func,
    settAktivtSteg: PropTypes.func,
    avvisDialog: PropTypes.func,
    navigasjontoggles: PropTypes.object,
    dokument: PropTypes.object,
};

export default Oppfolgingsdialog;
