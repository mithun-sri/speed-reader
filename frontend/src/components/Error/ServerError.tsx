import Error from "./Error";

const ServerError = () => {
  return (
    <Error title="500" description="Oops, something went wrong on our end." />
  );
};

export default ServerError;
