import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from 'digisyfo-npm';
import DineSykmeldinger from '../components/sykmeldinger/DineSykmeldinger';
import Feilmelding from '../components/Feilmelding';
import Side from '../sider/Side';
import AppSpinner from '../components/AppSpinner';
import { brodsmule as brodsmulePt, sykmelding as sykmeldingPt } from '../propTypes';
import { hentDineSykmeldinger } from '../actions/dineSykmeldinger_actions';

export class DineSykmldSide extends Component {
    componentWillMount() {
        if (!this.props.sykmeldingerHentet) {
            this.props.hentDineSykmeldinger();
        }
    }

    render() {
        const { brodsmuler, sykmeldinger, henter, hentingFeilet, sortering, sykmeldingerHentet } = this.props;
        return (<Side tittel={getLedetekst('dine-sykmeldinger.sidetittel')} brodsmuler={brodsmuler} laster={henter || !sykmeldingerHentet}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    } else if (hentingFeilet) {
                        return (<Feilmelding />);
                    }
                    return (<DineSykmeldinger
                        sykmeldinger={sykmeldinger}
                        sortering={sortering} />);
                })()
            }
        </Side>);
    }
}

DineSykmldSide.propTypes = {
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    sortering: PropTypes.shape({
        tidligere: PropTypes.string,
    }),
    sykmeldingerHentet: PropTypes.bool,
    hentDineSykmeldinger: PropTypes.func,
};

export function mapStateToProps(state) {
    return {
        sykmeldinger: state.dineSykmeldinger.data,
        sortering: state.dineSykmeldinger.sortering,
        sykmeldingerHentet: state.dineSykmeldinger.hentet,
        henter: state.ledetekster.henter || state.dineSykmeldinger.henter,
        hentingFeilet: state.ledetekster.hentingFeilet || state.dineSykmeldinger.hentingFeilet,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('dine-sykmeldinger.sidetittel'),
            sti: '/sykmeldinger',
        }],
    };
}

const DineSykmeldingerContainer = connect(mapStateToProps, { hentDineSykmeldinger })(DineSykmldSide);

export default DineSykmeldingerContainer;
