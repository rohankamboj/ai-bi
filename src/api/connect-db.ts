import Cookies from 'js-cookie';

type Props = {
  tableId: string;
};

const handleConnectDatabase = async (props: Props) => {
  try {
    // TODO: use Axios instead of fetch
    const res = await fetch(
      'https://aibi-backend-1060627628276.us-central1.run.app/db_connections/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          datasource: 'bigquery',
          table: props.tableId,
        }),
      }
    );

    const data = await res.json();
    return data;
  } catch {
    alert('Something went wrong');
    throw new Error('Something went wrong');
  }
};

export default handleConnectDatabase;
