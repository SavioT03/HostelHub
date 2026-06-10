const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="common-loader">
      <div
        className="spinner-border text-light"
        role="status"
      ></div>

      <p className="mt-3">{text}</p>
    </div>
  );
};

export default Loader;