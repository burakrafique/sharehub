const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <div className="flex-grow-1">
        {message || 'Something went wrong. Please try again.'}
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger ms-2" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;