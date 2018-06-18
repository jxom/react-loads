export const EVENTS = {
  ERROR: 'ERROR',
  FETCH: 'FETCH',
  RESET: 'RESET',
  SUCCESS: 'SUCCESS',
  TIMEOUT: 'TIMEOUT'
};

export const STATES = {
  ERROR: 'error',
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  TIMEOUT: 'timeout'
};

export default {
  initial: STATES.IDLE,
  states: {
    [STATES.IDLE]: {
      on: {
        [EVENTS.FETCH]: STATES.LOADING,
        [EVENTS.SUCCESS]: STATES.SUCCESS,
        [EVENTS.ERROR]: STATES.ERROR
      }
    },
    [STATES.LOADING]: {
      on: {
        [EVENTS.TIMEOUT]: STATES.TIMEOUT,
        [EVENTS.SUCCESS]: STATES.SUCCESS,
        [EVENTS.ERROR]: STATES.ERROR
      }
    },
    [STATES.TIMEOUT]: {
      on: {
        [EVENTS.FETCH]: STATES.LOADING,
        [EVENTS.SUCCESS]: STATES.SUCCESS,
        [EVENTS.ERROR]: STATES.ERROR
      }
    },
    [STATES.SUCCESS]: {
      on: {
        [EVENTS.RESET]: STATES.IDLE,
        [EVENTS.FETCH]: STATES.LOADING,
        [EVENTS.SUCCESS]: STATES.SUCCESS,
        [EVENTS.ERROR]: STATES.ERROR
      }
    },
    [STATES.ERROR]: {
      on: {
        [EVENTS.RESET]: STATES.IDLE,
        [EVENTS.FETCH]: STATES.LOADING,
        [EVENTS.SUCCESS]: STATES.SUCCESS,
        [EVENTS.ERROR]: STATES.ERROR
      }
    }
  }
};
