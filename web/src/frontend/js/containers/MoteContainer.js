import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { moteActions, svarActions, Kvittering, AvbruttMote, BekreftetKvittering, getSvarsideModus, Svarside, konstanter, proptypes } from 'moter-npm';
import { getLedetekst } from 'digisyfo-npm';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import Side from '../sider/Side';
import { bindActionCreators } from 'redux';

const { BEKREFTET, MOTESTATUS, BRUKER, AVBRUTT } = konstanter;

export const brukerHarSvart = (svartTidspunkt, created) => {
    if (!svartTidspunkt) {
        return false;
    }
    return svartTidspunkt > created;
};

export class Container extends Component {
    constructor(props) {
        super(props);
        props.actions.hentMote();
    }

    render() {
        const { henter, mote, brodsmuler, ledetekster, hentingFeilet, moteIkkeFunnet, actions } = this.props;
        const modus = getSvarsideModus(mote);
        return (<Side tittel={getLedetekst('mote.sidetittel', ledetekster)} brodsmuler={brodsmuler}>
        {
            (() => {
                if (henter) {
                    return <AppSpinner />;
                }
                if (hentingFeilet) {
                    return <Feilmelding />;
                }
                if (moteIkkeFunnet) {
                    return (<Feilmelding
                        tittel="Du har ingen møteforespørsel for øyeblikket"
                        melding="Er du sikker på at du er på riktig side?" />);
                }
                if (modus === BEKREFTET) {
                    return <BekreftetKvittering mote={mote} ledetekster={ledetekster} deltakertype={BRUKER} />;
                }
                if (modus === MOTESTATUS) {
                    return <Kvittering mote={mote} ledetekster={ledetekster} deltakertype={BRUKER} />;
                }
                if (modus === AVBRUTT) {
                    return (<AvbruttMote mote={mote} ledetekster={ledetekster} deltakertype={BRUKER} />);
                }
                if (mote) {
                    return <Svarside {...this.props} deltakertype={BRUKER} sendSvar={actions.sendSvar} />;
                }
                return <Feilmelding />;
            })()
        }
        </Side>);
    }
}

Container.propTypes = {
    henter: PropTypes.bool,
    fantIkkeDeltaker: PropTypes.bool,
    deltaker: PropTypes.object,
    brodsmuler: PropTypes.array,
    ledetekster: PropTypes.object,
    actions: PropTypes.object,
    hentingFeilet: PropTypes.bool,
    moteIkkeFunnet: PropTypes.bool,
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    mote: proptypes.mote,
};

export function mapDispatchToProps(dispatch) {
    const mActions = bindActionCreators(moteActions, dispatch);
    const sActions = bindActionCreators(svarActions, dispatch);
    return {
        actions: Object.assign({}, mActions, sActions),
    };
}

export function mapStateToProps(state) {
    const ledetekster = state.ledetekster.data;
    return {
        ledetekster,
        mote: state.mote.data,
        moteIkkeFunnet: state.mote.moteIkkeFunnet === true,
        henter: state.mote.henter,
        hentingFeilet: state.mote.hentingFeilet || state.ledetekster.hentingFeilet || false,
        sender: state.svar.sender,
        sendingFeilet: state.svar.sendingFeilet,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel', ledetekster),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('mote.sidetittel', ledetekster),
        }],
    };
}

const MoteContainer = connect(mapStateToProps, mapDispatchToProps)(Container);

export default MoteContainer;

