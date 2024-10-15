type Props = {
  user_id: string;
  url: string;
  headers?: object;
  parameters?: object;
};

const handleCreateNewAPIConnection = async (props: Props) => {
  console.log({ props });
  try {
    const res = await fetch(
      'https://aibi-backend-1060627628276.us-central1.run.app/api_connections/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          ...props,
        }),
      }
    );

    const data = await res.json();
    return data;
  } catch {
    throw new Error('Something went wrong');
  }
};

export default handleCreateNewAPIConnection;
