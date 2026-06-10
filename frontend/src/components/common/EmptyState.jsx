import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "📦",
  title = "Nothing Found",
  description = "No data available",
  buttonText,
  link,
  onClick,
}) => {

  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icon}
      </div>

      <h4 className="text-black">{title}</h4>

      <p>{description}</p>

      {buttonText && link && (
        <Link
          to={link}
          className="btn btn-primary px-4 mt-3"
        >
          {buttonText}
        </Link>
      )}

    </div>
  );
};

export default EmptyState;