import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import soknader from '../../js/reducers/soknader';
import * as actions from '../../js/actions/soknader_actions';
import mockSoknader, { getSoknad, soknadrespons } from '../mockSoknader';
import { TIL_SENDING } from '../../js/enums/soknadstatuser';

describe('soknader', () => {
    let getStateMedDataHentet;

    beforeEach(() => {
        getStateMedDataHentet = () => {
            const state = soknader();
            const action = actions.soknaderHentet(soknadrespons);
            return soknader(deepFreeze(state), action);
        };
    });

    it('Håndterer henter', () => {
        const action = actions.henterSoknader();
        const initState = soknader();
        const state = soknader(deepFreeze(initState), action);
        expect(state.henter).to.equal(true);
    });

    it('Håndterer hentSoknaderFeilet', () => {
        const action = actions.hentSoknaderFeilet();
        const initState = soknader();
        const state = soknader(deepFreeze(initState), action);
        expect(state.hentingFeilet).to.equal(true);
        expect(state.henter).to.equal(false);
        expect(state.hentet).to.equal(true);
    });

    it('Håndterer soknaderHentet', () => {
        const state = getStateMedDataHentet();
        expect(state.hentingFeilet).to.equal(false);
        expect(state.henter).to.equal(false);
        expect(state.data).to.deep.equal(mockSoknader);
    });

    it('Håndterer senderSoknad', () => {
        const initState = getStateMedDataHentet();
        const action = actions.senderSoknad(soknadrespons[0].id);
        const state = soknader(deepFreeze(initState), action);
        expect(state.sender).to.equal(true);
    });

    it('Håndterer soknadSendt', () => {
        const initState = getStateMedDataHentet();
        const data = {
            ...getSoknad(),
            test: 'ok',
        };
        const action2 = actions.senderSoknad();
        const initState2 = soknader(deepFreeze(initState), action2);
        const action = actions.soknadSendt(data);
        const state = soknader(deepFreeze(initState2), action);
        expect(state.sender).to.equal(false);
        const soknad = state.data.find((s) => {
            return s.id === soknadrespons[0].id;
        });
        const sendtSoknad = {
            ...data,
            status: TIL_SENDING,
        };
        expect(soknad).to.deep.equal(sendtSoknad);
    });

    it('Håndterer sendSoknadFeilet', () => {
        const initState = getStateMedDataHentet();
        const action = actions.sendSoknadFeilet(soknadrespons[0].id);
        const nextState = soknader(deepFreeze(initState), action);
        expect(nextState.sendingFeilet).to.equal(true);
    });

    it('Håndterer avbryterSoknad', () => {
        const initState = getStateMedDataHentet();
        const action = actions.avbryterSoknad(soknadrespons[0].id);
        const state = soknader(deepFreeze(initState), action);
        expect(state.avbryter).to.equal(true);
        expect(state.avbrytSoknadFeilet).to.equal(false);
    });

    it('Håndterer soknadAvbrutt', () => {
        const initState = getStateMedDataHentet();

        const avbryterAction = actions.avbryterSoknad();
        let nyState = soknader(deepFreeze(initState), avbryterAction);

        const avbruttAction = actions.soknadAvbrutt(nyState.data[0]);
        nyState = soknader(deepFreeze(nyState), avbruttAction);

        expect(nyState.data).to.deep.equal([]);
        expect(nyState.avbryter).to.equal(false);
        expect(nyState.avbrytSoknadFeilet).to.equal(false);
    });

    it('Håndterer avbrytSoknadFeilet', () => {
        const initState = getStateMedDataHentet();
        const action = actions.avbrytSoknadFeilet();
        const state = soknader(deepFreeze(initState), action);
        expect(state.avbryter).to.equal(false);
        expect(state.avbrytSoknadFeilet).to.equal(true);
    });
});
