import React, { PropTypes } from 'react';
import TidslinjeUtsnitt from '../components/TidslinjeUtsnitt.js';
import { connect } from 'react-redux';

export const TidzlinjeUtsnitt = (props) => {
    const { ledetekster, milepaeler } = props;
    return (<TidslinjeUtsnitt milepaeler={milepaeler} ledetekster={ledetekster} />);
};

TidzlinjeUtsnitt.propTypes = {
    ledetekster: PropTypes.object,
    milepaeler: PropTypes.object,
};

export function mapStateToProps(state) {
    const arbeidssituasjon = state.brukerinfo.data.arbeidssituasjon || 'arbeidstaker';
    const milepaeler = state.milepaeler.data.filter((milepael) => {
        return milepael.visning.indexOf(arbeidssituasjon) > -1;
    });

    return {
        ledetekster: state.ledetekster.data,
        milepaeler,
    };
}

const TidslinjeUtsnittContainer = connect(mapStateToProps)(TidzlinjeUtsnitt);

export default TidslinjeUtsnittContainer;
