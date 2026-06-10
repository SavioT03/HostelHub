const StatusBadge = ({ status }) => {

  const getBadgeClass = () => {

    switch (status) {

      case "approved":
        return "badge-approved";

      case "rejected":
        return "badge-rejected";

      default:
        return "badge-pending";

    }

  };

  return (
    <span className={`status-badge ${getBadgeClass()}`}>

      {status.charAt(0).toUpperCase() +
        status.slice(1)}

    </span>
  );
};

export default StatusBadge;