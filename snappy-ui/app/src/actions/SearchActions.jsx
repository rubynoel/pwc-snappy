const SEARCH_BEGIN = "SEARCH_BEGIN";
const SEARCH_SUCCESS = "SEARCH_SUCCESS";
const SEARCH_FAILURE = "SEARCH_FAILURE";

const searchBegin = searchParams => ({
  type: SEARCH_BEGIN,
  searchParams: searchParams
});

const searchSuccess = searchResults => ({
  type: SEARCH_SUCCESS,
  payload: searchResults
});

const searchFailure = error => ({
  type: SEARCH_FAILURE,
  payload: { error }
});

const paginateItems = paginationParams => {
  console.log(`Pagination request ${JSON.stringify(paginationParams)}`);
  return (dispatch, getState) => {
    var searchState = getState().search;
    console.log(`getState ${JSON.stringify(searchState)}`);

    let from = searchState.searchParams.from;
    console.log(`searchParams ${from}`);
    if (paginationParams.prev) {
      from = from > 0 ? from - searchState.limit : from;
    } else if (paginationParams.next) {
      from =
        from === searchState.total - searchState.limit
          ? from
          : from + searchState.limit;
    } else {
      console.log(`else ${paginationParams.pageNumber * searchState.limit}`);
      from =
        paginationParams.pageNumber * searchState.limit - searchState.limit;
    }
    console.log(`else ${from}`);
    let newParams = { ...searchState.searchParams, from };

    console.log(`pagination to search params:${JSON.stringify(newParams)}`);
    return doSearch(dispatch, newParams);
  };
};

const searchItems = searchParams => {
  console.log(`new search :${JSON.stringify(searchParams)}`);
  return dispatch => {
    return doSearch(dispatch, searchParams);
  };
};

const doSearch = async (dispatch, searchParams) => {
  dispatch(searchBegin(searchParams));
  const {keyword} = searchParams;
  let query = keyword ? { keyword: keyword } : {};
  let apiHost = "u7ae551eta.execute-api.ap-southeast-2.amazonaws.com";
  let pathString = `/search?${serializeQuery(searchParams)}`;
  fetch(
    `https://${apiHost}${pathString}`
  )
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log(`${JSON.stringify(json)}`);
      dispatch(searchSuccess(json));
      return json;
    })
    .catch(error => dispatch(searchFailure(error)));
};

const serializeQuery = query => {
  return Object.keys(query)
    .filter(key => query[key] !== undefined && query[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join("&");
};

export {
  SEARCH_BEGIN,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  searchItems,
  paginateItems
};
