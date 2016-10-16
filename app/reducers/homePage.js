import * as actionTypes from '../actions/homePage';

const {
  HOME_PAGE_ADD_HEADER_ROW,
  HOME_PAGE_REMOVE_HEADER_ROW,
  HOME_PAGE_HEADER_EDIT_KEY,
  HOME_PAGE_HEADER_EDIT_VAL,
  HOME_PAGE_SCHEME_ADD_ROW,
  HOME_PAGE_SCHEME_REMOVE_ROW,
  HOME_PAGE_SCHEME_EDIT_KEY,
  HOME_PAGE_SCHEME_EDIT_VAL,
  HOME_PAGE_CHOOSE_METHOD,
  HOME_PAGE_CHOOSE_FETCH_METHOD,
  HOME_PAGE_CHOOSE_LOCALE,
  HOME_PAGE_EDIT_URL,
  HOME_PAGE_SEND,
  HOME_PAGE_SEND_FAIL,
  HOME_PAGE_SEND_CHOOSE_N,
} = actionTypes;

const initialState = {
  headerRows: [{ k: 'Content-Type', v: 'application/json' }],
  schemeRows: [{ k: '', v: 'name.firstName' }],
  fetchMode: 'cors',
  fakerLocale: 'en',
  method: 'GET',
  url: '',
  working: false,
  n: '1',
  results: [],
};

export default function homePage(state = initialState, action: Object) {
  switch (action.type) {
    case HOME_PAGE_ADD_HEADER_ROW: {
      const rows = [...action.rows];
      rows.push({ k: '', v: '' });

      return {
        ...state,
        headerRows: rows,
      };
    }
    case HOME_PAGE_REMOVE_HEADER_ROW: {
      const rows = [...action.rows];
      rows.splice(action.index, 1);

      return {
        ...state,
        headerRows: rows,
      };
    }
    case HOME_PAGE_HEADER_EDIT_KEY: {
      const rows = [...action.rows];
      rows[action.index].k = action.v;

      return {
        ...state,
        headerRows: rows,
      };
    }
    case HOME_PAGE_HEADER_EDIT_VAL: {
      const rows = [...action.rows];
      rows[action.index].v = action.v;

      return {
        ...state,
        headerRows: rows,
      };
    }
    case HOME_PAGE_SCHEME_ADD_ROW: {
      const rows = [...action.rows];
      rows.push({ k: '', v: 'name.firstName' });

      return {
        ...state,
        schemeRows: rows,
      };
    }
    case HOME_PAGE_SCHEME_REMOVE_ROW: {
      const rows = [...action.rows];
      rows.splice(action.index, 1);

      return {
        ...state,
        schemeRows: rows,
      };
    }
    case HOME_PAGE_SCHEME_EDIT_KEY: {
      const rows = [...action.rows];
      rows[action.index].k = action.v;

      return {
        ...state,
        schemeRows: rows,
      };
    }
    case HOME_PAGE_SCHEME_EDIT_VAL: {
      const rows = [...action.rows];
      rows[action.index].v = action.v;

      return {
        ...state,
        schemeRows: rows,
      };
    }
    case HOME_PAGE_CHOOSE_METHOD: {
      const method = action.v;

      return {
        ...state,
        method,
      };
    }
    case HOME_PAGE_CHOOSE_FETCH_METHOD: {
      const fetchMode = action.v;

      return {
        ...state,
        fetchMode
      };
    }
    case HOME_PAGE_CHOOSE_LOCALE: {
      const fakerLocale = action.v;

      return {
        ...state,
        fakerLocale
      };
    }
    case HOME_PAGE_EDIT_URL: {
      const url = action.v;

      return {
        ...state,
        url,
      };
    }
    case HOME_PAGE_SEND: {
      const res = { ...action.res };

      return {
        ...state,
        results: res,
      };
    }
    case HOME_PAGE_SEND_FAIL: {
      return {
        ...state,
      };
    }
    case HOME_PAGE_SEND_CHOOSE_N: {
      const nn = action.v;

      return {
        ...state,
        n: nn,
      };
    }
    default:
      return state;
  }
}
