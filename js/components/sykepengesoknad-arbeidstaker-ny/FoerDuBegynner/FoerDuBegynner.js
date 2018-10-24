import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, sykmelding as sykmeldingPt } from 'digisyfo-npm';
import history from '../../../history';
import Soknadskjema from '../../soknad-felles/Soknadskjema';
import { ANSVARSERKLARING } from '../../../enums/tagtyper';
import Checkboxpanel from '../../soknad-felles-sporsmal/Checkboxpanel';
import { soknad as soknadPt } from '../../../propTypes';
import ForsteSoknadIntro from '../../sykepengesoknad-arbeidstaker/FoerDuBegynner/ForsteSoknadIntro';
import SoknadIntro from '../../sykepengesoknad-arbeidstaker/FoerDuBegynner/SoknadIntro';

export const hentSporsmalForDuBegynner = (soknad) => {
    return soknad.sporsmal.filter((s) => {
        return s.tag === ANSVARSERKLARING;
    });
};

const actionsPt = PropTypes.shape({
    sendSoknad: PropTypes.func,
    utfyllingStartet: PropTypes.func,
});

export class FoerDuBegynnerSkjema extends Component {
    componentDidMount() {
        if (this.props.soknad) {
            this.props.actions.utfyllingStartet(this.props.soknad.id);
        }
    }

    render() {
        const { handleSubmit, soknad } = this.props;
        const onSubmit = () => {
            history.push(`/sykefravaer/soknader/${soknad.id}/fravaer-og-friskmelding`);
        };

        const sporsmal = hentSporsmalForDuBegynner(soknad)[0];

        return (<form className="soknadskjema" id="foer-du-begynner-skjema" onSubmit={handleSubmit(onSubmit)}>
            <div className="panel redaksjonelt-innhold">
                <p className="blokk">{getLedetekst('sykepengesoknad.bekreft-ansvar.introtekst')}</p>
                <Checkboxpanel {...sporsmal} name={sporsmal.tag} />
            </div>
            <div className="knapperad blokk">
                <button type="submit" className="knapp js-ga-videre">{getLedetekst('sykepengesoknad.ga-videre')}</button>
            </div>
        </form>);
    }
}

FoerDuBegynnerSkjema.propTypes = {
    handleSubmit: PropTypes.func,
    utfyllingStartet: PropTypes.func,
    soknad: soknadPt,
    actions: actionsPt,
};

const FoerDuBegynner = (props) => {
    const intro = props.erForsteSoknad
        ? <ForsteSoknadIntro />
        : <SoknadIntro />;

    return (<Soknadskjema
        aktivtSteg="1"
        tittel={getLedetekst('sykepengesoknad.for-du-begynner.tittel')}
        intro={intro}
        sykmelding={props.sykmelding}
        soknad={props.soknad}>
        <FoerDuBegynnerSkjema
            actions={props.actions}
            soknad={props.soknad}
            handleSubmit={props.handleSubmit} />
    </Soknadskjema>);
};

FoerDuBegynner.propTypes = {
    sykmelding: sykmeldingPt,
    soknad: soknadPt,
    handleSubmit: PropTypes.func,
    erForsteSoknad: PropTypes.bool,
    actions: actionsPt,
};

export default FoerDuBegynner;