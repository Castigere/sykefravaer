import React, { PropTypes } from 'react';
import Landingsside from '../components/Landingsside.js';
import { connect } from 'react-redux';
import Side from '../sider/Side.js';
import { getLedetekst } from '../ledetekster';

export const LandingssideSide = (props) => {
    const { ledetekster, brodsmuler, skjulVarsel } = props;
    return (
        <Side tittel={getLedetekst('landingsside.sidetittel', ledetekster.data)} brodsmuler={brodsmuler}>
            <Landingsside skjulVarsel={skjulVarsel} ledetekster={ledetekster.data} />
        </Side>
    );
};

LandingssideSide.propTypes = {
    ledetekster: PropTypes.object,
    brodsmuler: PropTypes.array,
    skjulVarsel: PropTypes.bool,
};

export function mapStateToProps(state) {
    return {
        ledetekster: state.ledetekster,
        skjulVarsel: (state.brukerinfo && state.brukerinfo.innstillinger) ? (state.brukerinfo.innstillinger.skjulUnderUtviklingVarsel === true) : false,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel', state.ledetekster.data),
            sti: '/',
        }],
    };
}

const LandingssideContainer = connect(mapStateToProps)(LandingssideSide);

export default LandingssideContainer;
