export async function getRelatedResourceDeleteCounts(requests) {
  const results = {};
  let error = null;
  let hasCount = false;

  try {
    await Promise.all(
      requests.map(async ({ request, label }) => {
        const {
          items: { count },
        } = await request();
        if (count > 0) {
          results[label] = count;
          hasCount = true;
        }
      })
    );
  } catch (err) {
    error = err;
  }

  return {
    results: hasCount && results,
    error,
  };
}

export const relatedResourceDeleteRequests = {
  savingsPlan: (record, readRecordApi) => [
    {
      request: async () => readRecordApi(record.id),
      label: 'Plan',
    },
  ],
};
