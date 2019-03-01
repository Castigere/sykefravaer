import { hentSporsmalForOppsummering } from './Oppsummering';
import validerSporsmal from '../../validering/validerSporsmal';
import validerAktiviteterISykmeldingsperioden from '../aktiviteter-i-sykmeldingsperioden/validerAktiviteterISykmeldingsperioden';

export default (values, props) => {
    const sporsmal = hentSporsmalForOppsummering(props.soknad);
    const feilmeldinger = validerSporsmal(sporsmal, values);
    const feilmeldingerForrigeSide = validerAktiviteterISykmeldingsperioden(values, props);
    return {
        ...feilmeldinger,
        ...feilmeldingerForrigeSide,
    };
};