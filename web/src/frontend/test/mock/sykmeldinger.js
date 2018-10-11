/* eslint-disable max-len */
const selvstendigSykmelding = {
    id: 'b482fb7e-c67c-4e05-9daa-c2e82a8d09d9',
    startLegemeldtFravaer: '2018-09-18',
    skalViseSkravertFelt: true,
    identdato: '2018-09-18',
    status: 'BEKREFTET',
    naermesteLederStatus: null,
    innsendtArbeidsgivernavn: null,
    valgtArbeidssituasjon: 'NAERINGSDRIVENDE',
    mottakendeArbeidsgiver: null,
    orgnummer: null,
    sendtdato: '2018-09-27T13:51:43',
    sporsmal: {
        arbeidssituasjon: 'NAERINGSDRIVENDE',
        dekningsgrad: 100,
        harForsikring: true,
        fravaersperioder: [],
        harAnnetFravaer: false,
    },
    pasient: { fnr: '10101022222', fornavn: 'Frida', mellomnavn: 'Perma', etternavn: 'Frost' },
    arbeidsgiver: 'LOMMEN BARNEHAVE',
    stillingsprosent: 100,
    diagnose: {
        hoveddiagnose: { diagnose: 'TENDINITT INA', diagnosekode: 'L87', diagnosesystem: 'ICPC-2' },
        bidiagnoser: [{ diagnose: 'GANGLION SENE', diagnosekode: 'L87', diagnosesystem: 'ICPC-2' }],
        fravaersgrunnLovfestet: null,
        fravaerBeskrivelse: 'Medising årsak i kategorien annet',
        svangerskap: true,
        yrkesskade: true,
        yrkesskadeDato: '2018-09-18',
    },
    mulighetForArbeid: {
        perioder: [{
            fom: '2018-09-18',
            tom: '2018-09-26',
            grad: 100,
            behandlingsdager: null,
            reisetilskudd: null,
            avventende: null,
        }],
        aktivitetIkkeMulig433: ['Annet'],
        aktivitetIkkeMulig434: ['Annet'],
        aarsakAktivitetIkkeMulig433: 'andre årsaker til sykefravær',
        aarsakAktivitetIkkeMulig434: 'andre årsaker til sykefravær',
    },
    friskmelding: {
        arbeidsfoerEtterPerioden: true,
        hensynPaaArbeidsplassen: 'Må ta det pent',
        antarReturSammeArbeidsgiver: true,
        antattDatoReturSammeArbeidsgiver: '2018-09-18',
        antarReturAnnenArbeidsgiver: true,
        tilbakemeldingReturArbeid: '2018-09-18',
        utenArbeidsgiverAntarTilbakeIArbeid: false,
        utenArbeidsgiverAntarTilbakeIArbeidDato: null,
        utenArbeidsgiverTilbakemelding: null,
    },
    utdypendeOpplysninger: {
        sykehistorie: 'Langvarig korsryggsmerter. Ømhet og smerte',
        paavirkningArbeidsevne: 'Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket',
        resultatAvBehandling: 'Nei',
        henvisningUtredningBehandling: 'Henvist til fysio',
        grupper: [{
            id: '6.2',
            sporsmal: [{ id: '6.2.1', svar: 'Langvarig korsryggsmerter. Ømhet og smerte' }, {
                id: '6.2.2',
                svar: 'Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket',
            }, { id: '6.2.3', svar: 'Nei' }, { id: '6.2.4', svar: 'Henvist til fysio' }],
        }],
    },
    arbeidsevne: {
        tilretteleggingArbeidsplass: 'Fortsett som sist.',
        tiltakNAV: 'Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ',
        tiltakAndre: null,
    },
    meldingTilNav: { navBoerTaTakISaken: false, navBoerTaTakISakenBegrunnelse: null },
    innspillTilArbeidsgiver: null,
    tilbakedatering: { dokumenterbarPasientkontakt: null, tilbakedatertBegrunnelse: null },
    bekreftelse: { utstedelsesdato: '2018-09-18', sykmelder: 'Frida Perma Frost', sykmelderTlf: '94431152' },
};

const innsendtArbeidstakerSykmelding = {
    id: '02cb0660-41f3-4ce7-9cd5-579e7c7e9afa',
    startLegemeldtFravaer: '2018-09-19',
    skalViseSkravertFelt: true,
    identdato: '2018-09-19',
    status: 'SENDT',
    naermesteLederStatus: null,
    innsendtArbeidsgivernavn: 'BERGEN KOMMUNE HR KONSERN',
    valgtArbeidssituasjon: null,
    mottakendeArbeidsgiver: {
        navn: 'BERGEN KOMMUNE HR KONSERN',
        virksomhetsnummer: '900000000',
        juridiskOrgnummer: '800000000',
    },
    orgnummer: '900000000',
    sendtdato: '2018-09-28T11:54:00',
    sporsmal: {
        arbeidssituasjon: 'ARBEIDSTAKER',
        dekningsgrad: null,
        harForsikring: null,
        fravaersperioder: [],
        harAnnetFravaer: null,
    },
    pasient: { fnr: '11111122222', fornavn: 'Frida', mellomnavn: 'Perma', etternavn: 'Frost' },
    arbeidsgiver: 'LOMMEN BARNEHAVE',
    stillingsprosent: 100,
    diagnose: {
        hoveddiagnose: { diagnose: 'TENDINITT INA', diagnosekode: 'L87', diagnosesystem: 'ICPC-2' },
        bidiagnoser: [{ diagnose: 'GANGLION SENE', diagnosekode: 'L87', diagnosesystem: 'ICPC-2' }],
        fravaersgrunnLovfestet: null,
        fravaerBeskrivelse: 'Medising årsak i kategorien annet',
        svangerskap: true,
        yrkesskade: true,
        yrkesskadeDato: '2018-09-19',
    },
    mulighetForArbeid: {
        perioder: [{
            fom: '2018-09-19',
            tom: '2018-09-27',
            grad: 100,
            behandlingsdager: null,
            reisetilskudd: null,
            avventende: null,
        }],
        aktivitetIkkeMulig433: ['Annet'],
        aktivitetIkkeMulig434: ['Annet'],
        aarsakAktivitetIkkeMulig433: 'andre årsaker til sykefravær',
        aarsakAktivitetIkkeMulig434: 'andre årsaker til sykefravær',
    },
    friskmelding: {
        arbeidsfoerEtterPerioden: true,
        hensynPaaArbeidsplassen: 'Må ta det pent',
        antarReturSammeArbeidsgiver: true,
        antattDatoReturSammeArbeidsgiver: '2018-09-19',
        antarReturAnnenArbeidsgiver: true,
        tilbakemeldingReturArbeid: '2018-09-19',
        utenArbeidsgiverAntarTilbakeIArbeid: false,
        utenArbeidsgiverAntarTilbakeIArbeidDato: null,
        utenArbeidsgiverTilbakemelding: null,
    },
    utdypendeOpplysninger: {
        sykehistorie: 'Langvarig korsryggsmerter. Ømhet og smerte',
        paavirkningArbeidsevne: 'Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket',
        resultatAvBehandling: 'Nei',
        henvisningUtredningBehandling: 'Henvist til fysio',
        grupper: [{
            id: '6.2',
            sporsmal: [{ id: '6.2.1', svar: 'Langvarig korsryggsmerter. Ømhet og smerte' }, {
                id: '6.2.2',
                svar: 'Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket',
            }, { id: '6.2.3', svar: 'Nei' }, { id: '6.2.4', svar: 'Henvist til fysio' }],
        }],
    },
    arbeidsevne: {
        tilretteleggingArbeidsplass: 'Fortsett som sist.',
        tiltakNAV: 'Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ',
        tiltakAndre: null,
    },
    meldingTilNav: { navBoerTaTakISaken: false, navBoerTaTakISakenBegrunnelse: null },
    innspillTilArbeidsgiver: null,
    tilbakedatering: { dokumenterbarPasientkontakt: null, tilbakedatertBegrunnelse: null },
    bekreftelse: { utstedelsesdato: '2018-09-19', sykmelder: 'Frida Perma Frost', sykmelderTlf: '81549300' },
};

const sykmeldinger = [selvstendigSykmelding, innsendtArbeidstakerSykmelding];


module.exports = { sykmeldinger };
/* eslint-enable max-len */
