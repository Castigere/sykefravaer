import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as soknaderActions from '../data/soknader/soknaderActions';
import * as sykepengesoknaderActions from '../../actions/sykepengesoknader_actions';
import * as dineSykmeldingerActions from '../../actions/dineSykmeldinger_actions';
import Feilmelding from '../../components/Feilmelding';
import Side from '../../sider/Side';
import { ARBEIDSTAKERE, OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';
import SykepengesoknadUtlandSkjemaContainer from '../soknad-utland/skjema/SoknadUtlandSkjemaContainer';
import { ArbeidstakerSoknadHotjarTrigger, FrilanserSoknadHotjarTrigger, NyArbeidstakerSoknadHotjarTrigger, SykepengerUtlandSoknadTrigger } from '../../components/HotjarTrigger';
import beregnBrodsmulesti from '../utils/beregnBrodsmulesti';
import SoknadSelvstendigNaeringsdrivende from '../soknad-selvstendig-frilanser/SoknadSelvstendigNaeringsdrivende';
import SykepengesoknadArbeidstaker from '../../components/sykepengesoknad-arbeidstaker/SykepengesoknadArbeidstaker';
import NySoknadArbeidstaker from '../soknad-arbeidstaker/NySoknadArbeidstaker';

export class Container extends Component {
    componentDidMount() {
        this.props.actions.hentSykepengesoknader();
        this.props.actions.hentSoknader();
        this.props.actions.hentDineSykmeldinger();
    }

    componentDidUpdate() {
        this.props.actions.hentDineSykmeldinger();
    }

    render() {
        const {
            erArbeidstakersoknad,
            erSelvstendigNaeringsdrivendeSoknad,
            erSoknadOmUtenlandsopphold,
            erNyArbeidstakersoknad,
            skalHenteSykmeldinger,
            henter,
            sti,
        } = this.props;

        const brodsmuler = beregnBrodsmulesti(sti, this.props.soknadId);
        return (<Side brodsmuler={brodsmuler} tittel="Søknad om sykepenger" laster={skalHenteSykmeldinger || henter}>
            {(() => {
                if (henter) {
                    return <div />;
                }
                if (erArbeidstakersoknad) {
                    return (<ArbeidstakerSoknadHotjarTrigger>
                        <SykepengesoknadArbeidstaker {...this.props} />
                    </ArbeidstakerSoknadHotjarTrigger>);
                } else if (erSelvstendigNaeringsdrivendeSoknad) {
                    return (<FrilanserSoknadHotjarTrigger>
                        <SoknadSelvstendigNaeringsdrivende {...this.props} />
                    </FrilanserSoknadHotjarTrigger>);
                } else if (erSoknadOmUtenlandsopphold) {
                    return (<SykepengerUtlandSoknadTrigger>
                        <SykepengesoknadUtlandSkjemaContainer {...this.props} />
                    </SykepengerUtlandSoknadTrigger>);
                } else if (erNyArbeidstakersoknad) {
                    return (<NyArbeidstakerSoknadHotjarTrigger>
                        <NySoknadArbeidstaker {...this.props} />
                    </NyArbeidstakerSoknadHotjarTrigger>);
                }
                return <Feilmelding />;
            })()}
        </Side>);
    }
}

Container.propTypes = {
    actions: PropTypes.shape({
        hentSykepengesoknader: PropTypes.func,
        hentSoknader: PropTypes.func,
        hentDineSykmeldinger: PropTypes.func,
    }),
    skalHenteSykepengesoknader: PropTypes.bool,
    skalHenteSoknader: PropTypes.bool,
    skalHenteSykmeldinger: PropTypes.bool,
    erArbeidstakersoknad: PropTypes.bool,
    erSelvstendigNaeringsdrivendeSoknad: PropTypes.bool,
    erSoknadOmUtenlandsopphold: PropTypes.bool,
    erNyArbeidstakersoknad: PropTypes.bool,
    sti: PropTypes.string,
    henter: PropTypes.bool,
    soknadId: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...sykepengesoknaderActions,
            ...soknaderActions,
            ...dineSykmeldingerActions,
        }, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const soknadId = ownProps.params.sykepengesoknadId;
    const finnSoknad = (s) => {
        return s.id === soknadId;
    };
    const soknad = state.soknader.data.find(finnSoknad);
    const sykepengesoknad = state.sykepengesoknader.data.find(finnSoknad);
    const erSelvstendigNaeringsdrivendeSoknad = soknad !== undefined && soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE;
    const erSoknadOmUtenlandsopphold = soknad !== undefined && soknad.soknadstype === OPPHOLD_UTLAND;
    const erNyArbeidstakersoknad = soknad !== undefined && soknad.soknadstype === ARBEIDSTAKERE;
    const erArbeidstakersoknad = sykepengesoknad !== undefined;
    const skalHenteSykmeldinger = !state.dineSykmeldinger.hentet && !state.dineSykmeldinger.henter;
    const henter = state.soknader.henter
        || state.sykepengesoknader.henter
        || state.ledetekster.henter
        || (skalHenteSykmeldinger);
    const hentingFeilet = state.soknader.hentingFeilet || state.sykepengesoknader.hentingFeilet || state.ledetekster.hentingFeilet;

    return {
        soknadId,
        erSelvstendigNaeringsdrivendeSoknad,
        erSoknadOmUtenlandsopphold,
        erArbeidstakersoknad,
        erNyArbeidstakersoknad,
        henter,
        hentingFeilet,
        sti: ownProps.location.pathname,
        soknad,
        sykepengesoknad,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);