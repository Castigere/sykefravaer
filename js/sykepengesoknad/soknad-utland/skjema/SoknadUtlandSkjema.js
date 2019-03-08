import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { getLedetekst } from '@navikt/digisyfo-npm';
import { Fareknapp, Hovedknapp } from 'nav-frontend-knapper';
import Header from '../HeaderUtland';
import Sporsmal from '../../felleskomponenter/sporsmal/Sporsmal';
import { soknadPt } from '../../../propTypes/index';
import { SKJEMANAVN_OPPHOLD_UTLAND } from '../../../enums/skjemanavn';
import validate from '../validering/validerSoknadUtland';
import FeiloppsummeringContainer, { onSubmitFail } from '../../../containers/skjema/FeiloppsummeringContainer';
import populerSoknadMedSvar from '../../utils/populerSoknadMedSvar';
import { IKKE_RELEVANT, JA_NEI } from '../../enums/svartyper';
import { PERIODEUTLAND } from '../../enums/tagtyper';
import fraBackendsoknadTilInitiellSoknad from '../../utils/fraBackendsoknadTilInitiellSoknad';
import Feilstripe from '../../../components/Feilstripe';
import AvbrytSoknadContainer from '../../felleskomponenter/avbryt-soknad/AvbrytSoknadContainer';

export const SoknadUtlandSkjema = ({ soknad, handleSubmit, sender, sendSoknad, avbryter, avbrytSoknad, harFerie, avbrytSoknadFeilet, sendingFeilet }) => {
    const sporsmallisteSkjema = () => {
        return harFerie ? soknad.sporsmal.filter((sporsmal) => {
            return IKKE_RELEVANT !== sporsmal.svartype;
        }) : soknad.sporsmal;
    };

    const sporsmalsliste = sporsmallisteSkjema().map((sporsmal) => {
        const className = cn({ hovedsporsmal: sporsmal.svartype !== JA_NEI, 'blokk--xs': true });
        const ekstraProps = sporsmal.tag === PERIODEUTLAND
            ? { initiellDato: new Date() }
            : {};

        return (<div className={className} key={sporsmal.tag}>
            <Sporsmal
                soknad={soknad}
                hovedsporsmal
                sporsmal={sporsmal}
                name={sporsmal.tag}
                ekstraProps={ekstraProps}
            />
        </div>);
    });

    const onSubmit = (values) => {
        const populertSoknad = populerSoknadMedSvar(soknad, values);
        sendSoknad(populertSoknad);
    };

    const visKnapp = () => {
        return harFerie
            ? (<Fareknapp
                type="button"
                disabled={avbryter}
                spinner={avbryter}
                onClick={(event) => {
                    avbrytSoknad(soknad);
                    event.preventDefault();
                }}>{getLedetekst('sykepengesoknad.avbryt-soknad')}</Fareknapp>)
            : <Hovedknapp type="submit" disabled={sender} spinner={sender}>{getLedetekst('sykepengesoknad.send')}</Hovedknapp>;
    };

    return (<form className="soknadskjema" id="sykepengesoknad-utland-skjema" onSubmit={handleSubmit(onSubmit)}>
        <Header />
        <FeiloppsummeringContainer skjemanavn={SKJEMANAVN_OPPHOLD_UTLAND} />
        <div className={sendingFeilet || avbrytSoknadFeilet ? 'blokk' : null}>
            {sporsmalsliste}
        </div>
        <Feilstripe vis={sendingFeilet || avbrytSoknadFeilet} />
        <div className="knapperad blokk">
            {visKnapp()}
        </div>
        {!harFerie && <AvbrytSoknadContainer sykepengesoknad={soknad} />}
    </form>);
};

SoknadUtlandSkjema.propTypes = {
    soknad: soknadPt,
    harFerie: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    avbrytSoknadFeilet: PropTypes.bool,
    handleSubmit: PropTypes.func,
    sendSoknad: PropTypes.func,
    sender: PropTypes.bool,
    avbrytSoknad: PropTypes.func,
    avbryter: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
    return {
        initialValues: fraBackendsoknadTilInitiellSoknad(ownProps.soknad),
    };
};

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: SKJEMANAVN_OPPHOLD_UTLAND,
        validate,
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
        onSubmitFail: (errors, dispatch) => {
            onSubmitFail(errors, dispatch, SKJEMANAVN_OPPHOLD_UTLAND);
        },
    }),
)(SoknadUtlandSkjema);
