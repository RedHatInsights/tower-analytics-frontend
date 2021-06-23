import {
  getRelatedResourceDeleteCounts,
  relatedResourceDeleteRequests,
} from './getRelatedResourceDeleteDetails';
import mockResponses from './__fixtures__/';
import * as api from '../Api';
jest.mock('../Api');

describe('delete details', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call api for savings plan list', () => {
    const plan = api.readJobExplorer.mockResolvedValue(mockResponses.readPlan);
    getRelatedResourceDeleteCounts(
      relatedResourceDeleteRequests.savingsPlan({ id: 1 }, plan)
    );
    expect(plan).toBeCalledWith({
      params: {
        id: [1],
      },
    });
  });
});
