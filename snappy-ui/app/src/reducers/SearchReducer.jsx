import {
  SEARCH_BEGIN,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  paginationDefaults
} from "../actions/SearchActions";

const initialState = {
  searchParams: {
    from: paginationDefaults.from,
    limit: paginationDefaults.limit
  },
  total: 0,
  rows: [],
  loading: false,
  error: null
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        total: 0,
        searchParams: action.searchParams
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        rows: action.payload.rows,
        total: action.payload.total
      };

    case SEARCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        rows: [],
        total: 0
      };

    default:
      return state;
  }
};

export { searchReducer };
