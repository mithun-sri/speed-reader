import Error from "./Error";

const NotFound = () => {
  return (
    <Error
      title="404"
      description="The page you are looking for does not exist."
    />
  );
};

export default NotFound;
