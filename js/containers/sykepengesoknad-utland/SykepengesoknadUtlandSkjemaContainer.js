import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { soknad as soknadPt } from '../../propTypes';
import { NY, SENDT, TIL_SENDING } from '../../enums/soknadstatuser';
import UtlandsSkjema from '../../components/sykepengesoknad-utland/UtlandsSkjema/UtlandsSkjema';
import Feilmelding from '../../components/Feilmelding';
import { sendSoknad as sendSoknadAction, avbrytSoknad as avbrytSoknadAction } from '../../actions/soknader_actions';
import { OPPHOLD_UTLAND_SKJEMA } from '../../enums/skjemanavn';
import { formaterEnkeltverdi } from '../../components/soknad-felles/fieldUtils';
import { JA } from '../../enums/svarEnums';
import OppsummeringUtland from '../../components/sykepengesoknad-utland/Oppsummering/OppsummeringUtland';
import Kvittering from '../../components/sykepengesoknad-utland/Kvittering/Kvittering';
import { FERIE } from '../../enums/tagtyper';


export const UtlandSkjemaContainer = (props) => {
    const { soknad, sendSoknad, sender, avbryter, avbrytSoknad, sti, harFerie, avbrytSoknadFeilet, sendingFeilet } = props;
    if (soknad && soknad.status === NY) {
        return (<UtlandsSkjema
            soknad={soknad}
            sendSoknad={sendSoknad}
            sender={sender}
            sendingFeilet={sendingFeilet}
            avbrytSoknad={avbrytSoknad}
            avbryter={avbryter}
            avbrytSoknadFeilet={avbrytSoknadFeilet}
            harFerie={harFerie}
        />);
    }
    if (soknad && [SENDT, TIL_SENDING].indexOf(soknad.status) > -1) {
        if (sti.indexOf('kvittering') > -1) {
            return <Kvittering />;
        }
        return <OppsummeringUtland {...props} />;
    }
    return <Feilmelding />;
};

UtlandSkjemaContainer.propTypes = {
    soknad: soknadPt,
    actions: PropTypes.shape({
        sendSoknad: PropTypes.func,
        avbrytSoknad: PropTypes.func,
    }),
    sendSoknad: PropTypes.func,
    sendingFeilet: PropTypes.bool,
    sender: PropTypes.bool,
    avbrytSoknad: PropTypes.func,
    avbryter: PropTypes.bool,
    avbrytSoknadFeilet: PropTypes.bool,
    ferie: PropTypes.bool,
    sti: PropTypes.string,
    harFerie: PropTypes.bool,
};

export const finnSoknad = (state, ownProps) => {
    return state.soknader.data.find((s) => {
        return (s.id === ownProps.params.sykepengesoknadId) && (s.status === NY || s.status === TIL_SENDING || s.status === SENDT);
    });
};

export function mapStateToProps(state, ownProps) {
    const soknad = finnSoknad(state, ownProps);
    const selector = formValueSelector(OPPHOLD_UTLAND_SKJEMA);
    const feltVerdi = selector(state, FERIE);
    const harFerie = JA === formaterEnkeltverdi(feltVerdi);
    return {
        soknad,
        sti: ownProps.location.pathname,
        sendSoknad: state.soknader.senderSoknad,
        sender: state.soknader.sender,
        avbryter: state.soknader.avbryter,
        avbrytSoknadFeilet: state.soknader.avbrytSoknadFeilet,
        sendingFeilet: state.soknader.sendingFeilet,
        harFerie,
    };
}

export default connect(mapStateToProps, {
    sendSoknad: sendSoknadAction,
    avbrytSoknad: avbrytSoknadAction,
})(UtlandSkjemaContainer);