import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from 'digisyfo-npm';
import { bindActionCreators } from 'redux';
import Soknader from '../components/sykepengesoknader/Soknader';
import Side from './Side';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import { sykepengesoknad as sykepengesoknadPt, brodsmule as brodsmulePt, soknad as soknadPt } from '../propTypes/index';
import { hentSykepengesoknader } from '../actions/sykepengesoknader_actions';
import { hentSoknader } from '../actions/soknader_actions';

export class Container extends Component {
    componentWillMount() {
        if (this.props.skalHenteSykepengesoknader) {
            this.props.actions.hentSykepengesoknader();
        }
        if (this.props.skalHenteSoknader) {
            this.props.actions.hentSoknader();
        }
    }

    render() {
        const {
            brodsmuler,
            henter,
            hentingFeilet,
            sykepengesoknader,
            skalHenteSykepengesoknader,
            skalHenteSoknader,
            soknader,
            visFeil } = this.props;

        return (
            <Side tittel={getLedetekst('soknader.sidetittel')} brodsmuler={brodsmuler} laster={henter || skalHenteSoknader || skalHenteSykepengesoknader}>
                {
                    (() => {
                        if (henter) {
                            return <AppSpinner />;
                        }
                        if (hentingFeilet) {
                            return <Feilmelding />;
                        }
                        return (<Soknader sykepengesoknader={sykepengesoknader} soknader={soknader} visFeil={visFeil} />);
                    })()
                }
            </Side>
        );
    }
}

Container.propTypes = {
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    soknader: PropTypes.arrayOf(soknadPt),
    actions: PropTypes.shape({
        hentSykepengesoknader: PropTypes.func,
        hentSoknader: PropTypes.func,
    }),
    skalHenteSykepengesoknader: PropTypes.bool,
    skalHenteSoknader: PropTypes.bool,
    visFeil: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ hentSykepengesoknader, hentSoknader }, dispatch),
    };
}

export function mapStateToProps(state) {
    const sykepengesoknader = state.sykepengesoknader.data;
    const soknader = state.soknader.data;
    const skalHenteSoknader = !state.soknader.hentet && !state.soknader.henter;

    return {
        sykepengesoknader,
        soknader,
        skalHenteSykepengesoknader: !state.sykepengesoknader.hentet && !state.sykepengesoknader.henter,
        skalHenteSoknader,
        henter: state.ledetekster.henter || state.sykepengesoknader.henter || state.soknader.henter,
        hentingFeilet: state.ledetekster.hentingFeilet || (state.sykepengesoknader.hentingFeilet && state.soknader.hentingFeilet),
        visFeil: [state.soknader.hentingFeilet, state.sykepengesoknader.hentingFeilet].some((s) => {
            return s;
        }),
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('soknader.sidetittel'),
        }],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);