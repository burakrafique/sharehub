const EmptyState = ({ icon = 'inbox', title, message, action }) => {
  return (
    <div className="text-center py-5">
      <i className={`bi bi-${icon} text-muted`} style={{ fontSize: '4rem' }}></i>
      <h4 className="mt-3">{title}</h4>
      <p className="text-muted">{message}</p>
      {action && (
        <div className="mt-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;