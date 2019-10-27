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
  const { from, limit } = paginationDefaults;
  const apiHost = "ftgq3a6bw2.execute-api.ap-southeast-2.amazonaws.com/test";
  const pathString = `/search/${searchType}/${searchKeyword}?${serializeQuery({
    from,
    limit
  })}`;
  /*const opts = {
    method: "GET",
    service: "execute-api",
    region: "ap-southeast-2",
    path: `${pathString}`,
    host: apiHost,
    // headers: { "x-tes": "ddsada" },
    url: `https://${apiHost}${pathString}`
  };*/

  const opts = {
    method: "GET",
    service: "execute-api",
    region: "ap-southeast-2",
    path: `${pathString}`,
    host: apiHost,
    url: `https://${apiHost}${pathString}`
  };

  var request = await signRequest(opts);
  console.log(`API ${JSON.stringify(opts)}`);
  console.log(`API ${JSON.stringify(process.env)}`);
  console.log(`API ${JSON.stringify(request)}`);

  fetch(opts.url, {
    headers: request.headers
  })
    .then(res => res.json())
    .then(json => {
      dispatch(searchSuccess(json));
      return json;
    })
    .catch(error => dispatch(searchFailure(error)));

  /*fetch(`${opts.url}`, {
    mode: "cors",
    method: "GET"
  })*/
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
