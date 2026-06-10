const StatCard = ({ title, value, icon }) => {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="stat-card">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="stat-title">{title}</p>

            <h3 className="stat-value">{value}</h3>
          </div>

          <div className="stat-icon">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
