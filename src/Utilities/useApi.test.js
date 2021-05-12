import fetchMock from 'fetch-mock-jest';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import useApi from './useApi';

const dummyUrl = 'https://www.test.com';

const success = {
  url: dummyUrl,
  response: { msg: 'Success' },
};

const error = {
  url: dummyUrl,
  response: { throws: { status: 401, error: 'Error' }, status: 401 },
};

const fetchHandle = (url) => {
  return fetch(url).then((response) => response.json());
};

const mountHook = async (url, init) => {
  const hookReturn = renderHook(() => useApi(init));

  if (url !== null) {
    act(() => {
      hookReturn.result.current[1](url);
    });
    await hookReturn.waitForNextUpdate();
  }

  return hookReturn;
};

describe('Utilities/useApi', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should fetch null data', async () => {
    const { result } = await mountHook(null, null);
    const [data] = result.current;

    expect(data).toEqual({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
    });
  });

  it('should fetch initial data', async () => {
    fetchMock.get({ ...success });

    const { result } = await mountHook(fetchHandle(dummyUrl), {});
    const [data] = result.current;

    expect(data).toEqual({
      data: { msg: 'Success' },
      error: null,
      isLoading: false,
      isSuccess: true,
    });
  });

  it('should fetch initial data with error', async () => {
    fetchMock.get({ ...error });

    const { result } = await mountHook(fetchHandle(dummyUrl), {});
    const [data] = result.current;

    expect(data).toEqual({
      data: {},
      error: {
        error: 'Error',
        status: 401,
      },
      isLoading: false,
      isSuccess: false,
    });
  });

  it('should fetch on url change', async () => {
    fetchMock.get({ ...success });

    let { result, waitFor, waitForNextUpdate } = await mountHook(null, {});
    // Expect initial state
    expect(result.current[0]).toEqual({
      data: {},
      error: null,
      isLoading: false,
      isSuccess: false,
    });

    // Fire a url change.
    act(() => {
      result.current[1](fetchHandle(dummyUrl));
    });
    await waitFor(() => result.current[0].isLoading === true);
    // Expect loading state
    expect(result.current[0]).toEqual({
      data: {},
      error: null,
      isLoading: true,
      isSuccess: false,
    });

    await waitForNextUpdate();
    // Expect success state
    expect(result.current[0]).toEqual({
      data: { msg: 'Success' },
      error: null,
      isLoading: false,
      isSuccess: true,
    });
  });
});
