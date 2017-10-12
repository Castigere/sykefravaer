import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { moteActions, svarActions, Kvittering, MotePassert, AvbruttMote, BekreftetKvittering, getSvarsideModus, Svarside, konstanter, proptypes as moterPropTypes } from 'moter-npm';
import { getLedetekst } from 'digisyfo-npm';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import Side from '../sider/Side';
import { erMotePassert } from '../utils/moteUtils';
import { bindActionCreators } from 'redux';
import { brodsmule as brodsmulePt } from '../propTypes';

const { BEKREFTET, MOTESTATUS, BRUKER, AVBRUTT } = konstanter;

export class Container extends Component {
    componentWillMount() {
        this.props.actions.hentMote();
    }

    render() {
        const { henter, hentet, mote, brodsmuler, hentingFeilet, moteIkkeFunnet, actions } = this.props;
        const modus = getSvarsideModus(mote);
        return (<Side tittel={getLedetekst('mote.sidetittel')} brodsmuler={brodsmuler} laster={henter || !hentet}>
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
                if (erMotePassert(mote)) {
                    return <MotePassert deltakertype={BRUKER} />;
                }
                if (modus === BEKREFTET) {
                    return <BekreftetKvittering mote={mote} deltakertype={BRUKER} />;
                }
                if (modus === MOTESTATUS) {
                    return <Kvittering mote={mote} deltakertype={BRUKER} />;
                }
                if (modus === AVBRUTT) {
                    return (<AvbruttMote mote={mote} deltakertype={BRUKER} />);
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
    deltaker: moterPropTypes.deltaker,
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    actions: PropTypes.object,
    hentingFeilet: PropTypes.bool,
    moteIkkeFunnet: PropTypes.bool,
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    mote: moterPropTypes.mote,
    hentet: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
    const mActions = bindActionCreators(moteActions, dispatch);
    const sActions = bindActionCreators(svarActions, dispatch);
    return {
        actions: Object.assign({}, mActions, sActions),
    };
}

export function mapStateToProps(state) {
    return {
        mote: state.mote.data,
        moteIkkeFunnet: state.mote.moteIkkeFunnet === true,
        henter: state.mote.henter,
        hentet: state.mote.hentet === true,
        hentingFeilet: state.mote.hentingFeilet || state.ledetekster.hentingFeilet || false,
        sender: state.svar.sender,
        sendingFeilet: state.svar.sendingFeilet,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('mote.sidetittel'),
        }],
    };
}

const MoteContainer = connect(mapStateToProps, mapDispatchToProps)(Container);

export default MoteContainer;

