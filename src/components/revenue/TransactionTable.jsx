const TransactionTable = ({ 
  transactions, 
  loading, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'ETB 0.00';
    }
    return `ETB ${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-default';

    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
      case 'processing':
        return 'status-pending';
      case 'failed':
      case 'cancelled':
        return 'status-failed';
      default:
        return 'status-default';
    }
  };

  const getTypeClass = (type) => {
    if (!type) return 'type-default';

    switch (type.toLowerCase()) {
      case 'charging fee':
      case 'payment':
        return 'type-charging';
      case 'deposit':
        return 'type-deposit';
      case 'refund':
        return 'type-refund';
      case 'payout':
      case 'withdrawal':
        return 'type-payout';
      default:
        return 'type-default';
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="transaction-table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id || Math.random()}>
                  <td>{transaction.date || 'N/A'}</td>
                  <td className="transaction-id">{transaction.transactionId || transaction.id || 'N/A'}</td>
                  <td>
                    <span className={`transaction-type ${getTypeClass(transaction.type)}`}>
                      {transaction.type || 'Unknown'}
                    </span>
                  </td>
                  <td className="description">{transaction.description || 'No description'}</td>
                  <td className="amount">{formatCurrency(transaction.amount || 0)}</td>
                  <td>
                    <span className={`transaction-status ${getStatusClass(transaction.status)}`}>
                      {transaction.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
