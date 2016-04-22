import React, { PropTypes } from 'react';
import Dropdown from '../components/Dropdown.js';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/sykmeldinger_actions.js';

const DropdownContainer = ({ alternativer, sorterSykmeldinger }) => {
    return (<div className="header-verktoy">
        <label htmlFor="sykmeldinger-sortering" className="header-verktoy-label">Sorter etter</label>
        <Dropdown alternativer={alternativer} id="sykmeldinger-sortering" ariaControls="sykmelding-liste" onChange={sorterSykmeldinger} />
    </div>);
};

DropdownContainer.propTypes = {
    alternativer: PropTypes.array,
    sorterSykmeldinger: PropTypes.function,
};

function mapStateToProps() {
    return {
        alternativer: [{
            tekst: 'Dato',
            verdi: 'fom',
        }, {
            tekst: 'Arbeidsgiver',
            verdi: 'arbeidsgiver',
        }],
    };
}

const SykmeldingerSorteringContainer = connect(mapStateToProps, actionCreators)(DropdownContainer);

export default SykmeldingerSorteringContainer;
