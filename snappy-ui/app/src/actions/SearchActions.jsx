import { signRequest } from "../auth/AuthUtil";

const SEARCH_BEGIN = "SEARCH_BEGIN";
const SEARCH_SUCCESS = "SEARCH_SUCCESS";
const SEARCH_FAILURE = "SEARCH_FAILURE";

const searchBegin = searchParams => ({
  type: SEARCH_BEGIN,
  searchParams
});

const searchSuccess = searchResults => ({
  type: SEARCH_SUCCESS,
  payload: searchResults
});

const searchFailure = error => ({
  type: SEARCH_FAILURE,
  payload: { error }
});

const paginationDefaults = {
  from: 0,
  limit: 100
};

const serializeQuery = query =>
  Object.keys(query)
    .filter(key => query[key] !== undefined && query[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join("&");

const doSearch = async (dispatch, searchParams) => {
  dispatch(searchBegin(searchParams));
  const { searchKeyword, searchType } = searchParams;
  const {
    from = paginationDefaults.from,
    limit = paginationDefaults.limit
  } = searchParams;
  const apiHost = "ftgq3a6bw2.execute-api.ap-southeast-2.amazonaws.com/test";
  const pathString = `/search/${searchType}/${searchKeyword}?${serializeQuery({
    from,
    limit
  })}`;

  const opts = {
    method: "GET",
    service: "execute-api",
    region: "ap-southeast-2",
    path: `${pathString}`,
    host: apiHost,
    url: `https://${apiHost}${pathString}`
  };

  var request = await signRequest(opts);
  fetch(opts.url, {
    headers: request.headers
  })
    .then(res => res.json())
    .then(json => {
      dispatch(searchSuccess(json));
      return json;
    })
    .catch(error => dispatch(searchFailure(error)));
};

const paginateItems = paginationParams => (dispatch, getState) => {
  const searchState = getState().search;

  let { limit } = searchState.searchParams;
  const { pageNumber } = paginationParams;
  const from = pageNumber * limit;

  const newParams = { ...searchState.searchParams, from };
  return doSearch(dispatch, newParams);
};

const searchItems = searchParams => dispatch =>
  doSearch(dispatch, searchParams);

export {
  SEARCH_BEGIN,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  searchItems,
  paginateItems,
  paginationDefaults
};
