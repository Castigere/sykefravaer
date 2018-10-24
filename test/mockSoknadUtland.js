export const parsetSoknadUtland1 = {
    id: '67118cde-dbe1-4f2a-9d4b-2ba7c046242d',
    sykmeldingId: '22',
    soknadstype: 'OPPHOLD_UTLAND',
    status: 'NY',
    fom: new Date('2018-06-27'),
    tom: new Date('2018-06-28'),
    opprettetDato: new Date('2018-06-29'),
    sporsmal: [{
        id: '10',
        tag: 'PERIODEUTLAND',
        sporsmalstekst: 'Når skal du være utenfor Norge?',
        undertekst: null,
        svartype: 'PERIODER',
        min: new Date('2018-06-27'),
        max: new Date('2018-06-28'),
        kriterieForVisningAvUndersporsmal: null,
        svar: [],
        undersporsmal: [],
    }, {
        id: '101',
        tag: 'LAND',
        sporsmalstekst: 'Hvilket land skal du reise til?',
        undertekst: null,
        svartype: 'FRITEKST',
        min: null,
        max: 100,
        kriterieForVisningAvUndersporsmal: null,
        svar: [],
        undersporsmal: [],
    }, {
        id: '102',
        tag: 'ARBEIDSGIVER',
        sporsmalstekst: 'Har du arbeidsgiver?',
        undertekst: null,
        svartype: 'JA_NEI',
        min: null,
        max: null,
        kriterieForVisningAvUndersporsmal: 'JA',
        svar: [],
        undersporsmal: [{
            id: '103',
            tag: 'SYKMELDINGSGRAD',
            sporsmalstekst: 'Er du 100% sykmeldt?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            kriterieForVisningAvUndersporsmal: null,
            svar: [],
            undersporsmal: [],
        },
        {
            id: '104',
            tag: 'FERIE',
            sporsmalstekst: 'Skal du ha ferie i hele perioden?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            kriterieForVisningAvUndersporsmal: null,
            svar: [],
            undersporsmal: [],
        }],
    }, {
        id: '105',
        kriterieForVisningAvUndersporsmal: '',
        max: null,
        min: null,
        sporsmalstekst: 'Før du reiser trenger vi denne bekreftelsen fra deg',
        svar: [],
        svartype: 'IKKE_RELEVANT',
        tag: 'BEKREFT_OPPLYSNINGER_UTLAND_INFO',
        undersporsmal: [{
            id: '106',
            kriterieForVisningAvUndersporsmal: null,
            max: null,
            min: null,
            sporsmalstekst: 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
            svar: [],
            svartype: 'CHECKBOX_PANEL',
            tag: 'BEKREFT_OPPLYSNINGER_UTLAND',
            undersporsmal: [],
            undertekst: null,
        }],
        undertekst: '<ul>' +
        '<li>Reisen vil ikke gjøre at jeg blir dårligere</li>' +
        '<li>Reisen vil ikke gjøre at sykefraværet blir lengre</li>' +
        '<li>Reisen vil ikke hindre planlagt behandling eller oppfølging</li>' +
        '</ul>',
    }],
};

export const soknadUtland1 = {
    id: '67118cde-dbe1-4f2a-9d4b-2ba7c046242d',
    sykmeldingId: '22',
    soknadstype: 'OPPHOLD_UTLAND',
    status: 'NY',
    fom: '2018-06-27',
    tom: '2018-08-28',
    opprettetDato: '2018-06-29',
    sporsmal: [{
        id: '103',
        tag: 'PERIODEUTLAND',
        sporsmalstekst: 'Når skal du være utenfor Norge?',
        undertekst: null,
        svartype: 'PERIODER',
        min: '2018-06-27',
        max: '2018-08-28',
        kriterieForVisningAvUndersporsmal: null,
        svar: [],
        undersporsmal: [],
    }, {
        id: '102',
        tag: 'LAND',
        sporsmalstekst: 'Hvilket land skal du reise til?',
        undertekst: null,
        svartype: 'FRITEKST',
        min: null,
        max: 100,
        kriterieForVisningAvUndersporsmal: null,
        svar: [],
        undersporsmal: [],
    }, {
        id: '100',
        tag: 'ARBEIDSGIVER',
        sporsmalstekst: 'Har du arbeidsgiver?',
        undertekst: null,
        svartype: 'JA_NEI',
        min: null,
        max: null,
        kriterieForVisningAvUndersporsmal: 'JA',
        svar: [],
        undersporsmal: [{
            id: '101',
            tag: 'SYKMELDINGSGRAD',
            sporsmalstekst: 'Er du 100% sykmeldt?',
            undertekst: null,
            svartype: 'JA_NEI',
            min: null,
            max: null,
            introtekst: null,
            kriterieForVisningAvUndersporsmal: null,
            svar: [],
            undersporsmal: [],
        }],
    }, {
        id: '104',
        kriterieForVisningAvUndersporsmal: '',
        max: null,
        min: null,
        sporsmalstekst: 'Før du reiser trenger vi denne bekreftelsen fra deg',
        svar: [],
        svartype: 'IKKE_RELEVANT',
        tag: 'BEKREFT_OPPLYSNINGER_UTLAND_INFO',
        undersporsmal: [{
            id: '105',
            kriterieForVisningAvUndersporsmal: null,
            max: null,
            min: null,
            sporsmalstekst: 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
            svar: [],
            svartype: 'CHECKBOX_PANEL',
            tag: 'BEKREFT_OPPLYSNINGER_UTLAND',
            undersporsmal: [],
            undertekst: null,
        }],
        undertekst: '<ul>\n' +
        '    <li>Reisen vil ikke gjøre at jeg blir dårligere</li>\n' +
        '    <li>Reisen vil ikke gjøre at sykefraværet blir lengre</li>\n' +
        '    <li>Reisen vil ikke hindre planlagt behandling eller oppfølging</li>\n' +
        '</ul>',
    }],
};

export const getSoknadUtland = (soknad = {}) => {
    return {
        ...parsetSoknadUtland1,
        ...soknad,
    };
};

export const soknadUtlandRespons = [soknadUtland1];
export const soknadUtlandParset = [parsetSoknadUtland1];
