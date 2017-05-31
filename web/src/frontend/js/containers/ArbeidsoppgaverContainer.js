import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Side from '../sider/Side';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import history from '../history';
import { getOppfolgingsdialog } from '../utils/oppfolgingsdialogUtils';
import {
    lagreArbeidsoppgave,
    OppfolgingsdialogSide,
    OppfolgingsdialogOppgaveTabell,
} from 'oppfolgingsdialog-npm';
import { getLedetekst } from 'digisyfo-npm';
import { brodsmule as brodsmulePt } from '../propTypes';
import LagreArbeidsoppgaveSkjema from '../components/oppfolgingsdialoger/LagreArbeidsoppgaveSkjema';

export class ArbeidsoppgaverSide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visArbeidsoppgaveSkjema: false,
        };
        this.toggleArbeidsoppgaveSkjema = this.toggleArbeidsoppgaveSkjema.bind(this);
        this.sendArbeidsoppgave = this.sendArbeidsoppgave.bind(this);
    }

    toggleArbeidsoppgaveSkjema() {
        this.setState({
            visArbeidsoppgaveSkjema: !this.state.visArbeidsoppgaveSkjema,
        });
    }

    sendArbeidsoppgave(values) {
        this.props.lagreArbeidsoppgave(this.props.oppfolgingsdialogId, values);
        history.push(`/sykefravaer/oppfolgingsdialoger/${this.props.oppfolgingsdialogId}/arbeidsoppgaver`);
    }

    render() {
        const { brodsmuler, ledetekster, oppfolgingsdialog, oppfolgingsdialogId, henter, hentingFeilet, sender, senderFeilet } = this.props;

        return (<Side tittel={getLedetekst('oppfolgingsdialog.sidetittel')} brodsmuler={brodsmuler}>
            { (() => {
                if (henter || sender) {
                    return <AppSpinner />;
                } else if (hentingFeilet || senderFeilet) {
                    return (<Feilmelding />);
                }
                return (
                    <OppfolgingsdialogSide
                        brukernavn={oppfolgingsdialog.virksomhetsnavn}
                        ledetekster={ledetekster}
                        rootUrl={`/sykefravaer/oppfolgingsdialoger/${oppfolgingsdialogId}`}>
                        {
                            oppfolgingsdialog.arbeidsoppgaveListe.length === 0 ?
                                <div>
                                    <h2>{getLedetekst('oppfolgingsdialog.arbeidstaker.arbeidsoppgave.opprett.tittel', ledetekster)}</h2>
                                    <LagreArbeidsoppgaveSkjema
                                        ledetekster={ledetekster}
                                        avbrytHref={`/sykefravaer/oppfolgingsdialoger/${oppfolgingsdialogId}`}
                                        sendArbeidsoppgave={this.sendArbeidsoppgave}
                                    />
                                </div>
                                :
                                <div>
                                    <OppfolgingsdialogOppgaveTabell
                                        arbeidsoppgaveListe={oppfolgingsdialog.arbeidsoppgaveListe} />
                                    {
                                        this.state.visArbeidsoppgaveSkjema ?
                                            <LagreArbeidsoppgaveSkjema
                                                ledetekster={ledetekster}
                                                avbrytHref={`/sykefravaer/oppfolgingsdialoger/${oppfolgingsdialogId}/arbeidsoppgaver`}
                                                sendArbeidsoppgave={this.sendArbeidsoppgave}
                                                cancel={this.toggleArbeidsoppgaveSkjema}
                                            /> :
                                            <div className="knapperad">
                                                <button
                                                    className="knapp knapp__opprettarbeidsoppgave"
                                                    onClick={this.toggleArbeidsoppgaveSkjema}>
                                                    {getLedetekst('oppfolgingsdialog.arbeidstaker.knapp.leggtil-arbeidsoppgave')}
                                                </button>
                                            </div>
                                    }
                                </div>
                        }
                    </OppfolgingsdialogSide>
                );
            })()
            }
        </Side>);
    }
}

ArbeidsoppgaverSide.propTypes = {
    dispatch: PropTypes.func,
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    ledetekster: PropTypes.object,
    oppfolgingsdialog: PropTypes.object,
    oppfolgingsdialogId: PropTypes.string,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    sender: PropTypes.bool,
    senderFeilet: PropTypes.bool,
    lagreArbeidsoppgave: PropTypes.func,
};

export function mapStateToProps(state, ownProps) {
    const oppfolgingsdialogId = ownProps.params.oppfolgingsdialogId;
    const oppfolgingsdialog = getOppfolgingsdialog(state.oppfolgingsdialoger.data, oppfolgingsdialogId);
    const virksomhetsnavn = oppfolgingsdialog ? oppfolgingsdialog.virksomhetsnavn : '';

    return {
        ledetekster: state.ledetekster.data,
        henter: state.oppfolgingsdialoger.henter || state.ledetekster.henter,
        hentingFeilet: state.oppfolgingsdialoger.hentingFeilet || state.ledetekster.hentingFeilet,
        sender: state.arbeidsoppgaver.sender,
        sendingFeilet: state.arbeidsoppgaver.sendingFeilet,
        oppfolgingsdialog,
        oppfolgingsdialogId,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('oppfolgingsdialoger.sidetittel'),
            sti: '/oppfolgingsdialoger',
            erKlikkbar: true,
        }, {
            tittel: virksomhetsnavn,
        }],
    };
}

const ArbeidsoppgaverContainer = connect(mapStateToProps, { lagreArbeidsoppgave })(ArbeidsoppgaverSide);

export default ArbeidsoppgaverContainer;
