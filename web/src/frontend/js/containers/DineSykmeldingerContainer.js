import React, { PropTypes } from 'react';
import DineSykmeldinger from '../components/DineSykmeldinger.js';
import { connect } from 'react-redux';
import Side from '../sider/Side.js';
import AppSpinner from '../components/AppSpinner.js';
import { getLedetekst } from '../ledetekster';
import Feilmelding from '../components/Feilmelding.js';
import { sorterSykmeldinger } from '../utils';

const DineSykmldSide = (props) => {
    return (<Side tittel={getLedetekst('dine-sykmeldinger.sidetittel', props.ledetekster.data)} brodsmuler={props.brodsmuler}>
        {
            (() => {
                if (props.sykmeldinger.henter) {
                    return <AppSpinner ledetekster={props.ledetekster.data} />;
                } else if (props.sykmeldinger.hentingFeilet) {
                    return (<Feilmelding tittel="Det oppstod en feil" melding="Vennligst prøv igjen litt senere" />);
                }
                return <DineSykmeldinger sykmeldinger={sorterSykmeldinger(props.sykmeldinger.data, props.sykmeldinger.sortering)} ledetekster={props.ledetekster.data} />;
            })()
        }
    </Side>);
};

DineSykmldSide.propTypes = {
    props: PropTypes.object,
    ledetekster: PropTypes.object,
    brodsmuler: PropTypes.array,
    sykmeldinger: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        sykmeldinger: state.sykmeldinger,
        ledetekster: state.ledetekster,
        brodsmuler: [{
            tittel: 'Dine sykmeldinger',
            sti: '/sykmeldinger',
        }],
    };
}

const DineSykmeldingerContainer = connect(mapStateToProps)(DineSykmldSide);

export default DineSykmeldingerContainer;

