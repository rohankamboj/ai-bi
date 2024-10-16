import Cookies from 'js-cookie';

type Props = {
  user_id: string;
  dashboard_name: string;
};

const handleCreateDashboard = async (props: Props) => {
  try {
    // TODO: use Axios instead of fetch
    const res = await fetch(
      'https://aibi-backend-1060627628276.us-central1.run.app/dashboards/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          user_id: props.user_id,
          dashboard_name: props.dashboard_name,
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

export default handleCreateDashboard;
