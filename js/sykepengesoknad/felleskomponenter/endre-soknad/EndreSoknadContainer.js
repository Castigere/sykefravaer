import { connect } from 'react-redux';
import EndreSoknad from './EndreSoknad';
import { opprettUtkastTilKorrigeringForespurt } from '../../data/soknader/soknaderActions';

export const mapStateToProps = (state, ownProps) => {
    const soknad = ownProps.soknad;
    const ETT_AAR_SIDEN = new Date();
    ETT_AAR_SIDEN.setYear(ETT_AAR_SIDEN.getFullYear() - 1);
    const vis = soknad.opprettetDato >= ETT_AAR_SIDEN;
    return {
        vis,
        endrer: state.soknader.endrer,
        endringFeilet: state.soknader.endringFeilet,
    };
};

const EndreSoknadContainer = connect(mapStateToProps, { endreSoknad: opprettUtkastTilKorrigeringForespurt })(EndreSoknad);

export default EndreSoknadContainer;