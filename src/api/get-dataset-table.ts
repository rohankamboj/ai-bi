import Cookies from 'js-cookie';

const handleGetDatasetsTables = async ({ dataset }: { dataset: string }) => {
  try {
    // TODO: use Axios instead of fetch
    const res = await fetch(
      `https://aibi-backend-1060627628276.us-central1.run.app/bigquery/datasets/${dataset}/tables`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    );

    const data = await res.json();
    return data;
  } catch {
    throw new Error('Something went wrong');
  }
};

export default handleGetDatasetsTables;
