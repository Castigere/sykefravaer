import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLedetekst } from 'digisyfo-npm';
import Dropdown from '../components/skjema/Dropdown';
import * as actionCreators from '../actions/dineSykmeldinger_actions';

const DropdownContainer = ({ alternativer, sorterSykmeldinger, status }) => {
    return (<div className="inngangspanelerHeader__verktoy">
        <label htmlFor="sykmeldinger-sortering" className="inngangspanelerHeader__verktoyLabel">{getLedetekst('dine-sykmeldinger.sorter.label')}</label>
        <div className="selectContainer selectContainer--liten">
            <Dropdown
                alternativer={alternativer}
                id="sykmeldinger-sortering"
                ariaControls={`sykmelding-liste-${status}`}
                onChange={(kriterium) => {
                    sorterSykmeldinger(kriterium, status);
                }} />
        </div>
    </div>);
};

DropdownContainer.propTypes = {
    alternativer: PropTypes.arrayOf(PropTypes.shape({
        tekst: PropTypes.string,
        verdi: PropTypes.string,
    })),
    sorterSykmeldinger: PropTypes.func,
    status: PropTypes.string,
};

function mapStateToProps() {
    return {
        alternativer: [{
            tekst: getLedetekst('dine-sykmeldinger.sorter.dato'),
            verdi: 'fom',
        }, {
            tekst: getLedetekst('dine-sykmeldinger.sorter.arbeidsgiver'),
            verdi: 'arbeidsgiver',
        }],
    };
}

const SykmeldingerSorteringContainer = connect(mapStateToProps, actionCreators)(DropdownContainer);

export default SykmeldingerSorteringContainer;
