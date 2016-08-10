const initiellState = {
    henter: false,
    arbeidsforhold: [],
    hentingFeilet: false,
    data: [],
    erFeil: false,
};

export default function sykmeldinger(state = initiellState, action) {
    switch (action.type) {
        case 'SET_DINE_SYKMELDINGER': {
            if (!state.data || state.data.length === 0) {
                return {
                    data: action.sykmeldinger,
                    henter: false,
                    hentingFeilet: false,
                };
            }
            return {
                data: state.data.map((gammelSykmelding) => {
                    const nySykmelding = action.sykmeldinger.filter((sykmld) => {
                        return sykmld.id === gammelSykmelding.id;
                    })[0];
                    return Object.assign({}, gammelSykmelding, nySykmelding);
                }),
                henter: false,
                hentingFeilet: false,
            };
        }
        case 'HENTER_DINE_SYKMELDINGER': {
            return {
                data: state.data,
                henter: true,
                hentingFeilet: false,
            };
        }
        case 'HENT_DINE_SYKMELDINGER_FEILET': {
            return {
                data: [],
                henter: false,
                hentingFeilet: true,
            };
        }
        case 'SET_ARBEIDSSITUASJON': {
            const data = state.data.map((sykmelding) => {
                const _sykmelding = Object.assign({}, sykmelding);
                if (_sykmelding.id === action.sykmeldingId) {
                    _sykmelding.arbeidssituasjon = action.arbeidssituasjon;
                }
                return _sykmelding;
            });
            return Object.assign({}, state, { data });
        }
        case 'SYKMELDING_BEKREFTET': {
            const data = state.data.map((sykmelding) => {
                const _sykmelding = Object.assign({}, sykmelding);
                if (_sykmelding.id === action.sykmeldingId) {
                    _sykmelding.status = 'BEKREFTET';
                    _sykmelding.nettoppBekreftet = true;
                }
                return _sykmelding;
            });
            return Object.assign({}, state, { data });
        }
        case 'NAVIGER_FRA_BEKREFTETKVITTERING': {
            const data = state.data.map((sykmelding) => {
                const _sykmelding = Object.assign({}, sykmelding);
                if (_sykmelding.id === action.sykmeldingId) {
                    _sykmelding.nettoppBekreftet = false;
                }
                return _sykmelding;
            });
            return Object.assign({}, state, { data });
        }
        case 'SET_SORTERING': {
            let sortering = {};
            sortering[action.status] = action.kriterium;
            sortering = Object.assign({}, state.sortering, sortering);
            return Object.assign({}, state, {
                sortering,
            });
        }
        default: {
            return state;
        }
    }
}
