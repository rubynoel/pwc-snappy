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
  const { from, limit } = paginationDefaults;
  const apiHost = "ftgq3a6bw2.execute-api.ap-southeast-2.amazonaws.com/dev";
  const pathString = `/search/${searchType}/${searchKeyword}?${serializeQuery({
    from,
    limit
  })}`;
  fetch(`https://${apiHost}${pathString}`)
    .then(res => res.json())
    .then(json => {
      dispatch(searchSuccess(json));
      return json;
    })
    .catch(error => dispatch(searchFailure(error)));
};

const paginateItems = paginationParams => (dispatch, getState) => {
  const searchState = getState().search;

  let { from } = searchState.searchParams;
  if (paginationParams.prev) {
    from = from > 0 ? from - searchState.limit : from;
  } else if (paginationParams.next) {
    from =
      from === searchState.total - searchState.limit
        ? from
        : from + searchState.limit;
  } else {
    from = paginationParams.pageNumber * searchState.limit - searchState.limit;
  }
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
  paginateItems
};
