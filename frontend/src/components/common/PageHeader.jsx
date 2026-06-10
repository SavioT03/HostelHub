const PageHeader = ({
  title,
  subtitle,
  actionButton,
}) => {
  return (
    <div className="page-header">

      <div>

        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}

      </div>

      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}

    </div>
  );
};

export default PageHeader;