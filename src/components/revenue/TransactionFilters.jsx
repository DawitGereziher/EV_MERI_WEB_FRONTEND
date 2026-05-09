const TransactionFilters = ({ filterType, setFilterType }) => {
  const filterOptions = [
    'All Types',
    'Charging Payment',
    'Simple Charging',
    'Deposits',
    'Payouts',
    'Charging Fees',
    'Refunds'
  ];

  return (
    <div className="transaction-filters">
      <div className="filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`filter-tab ${filterType === option ? 'active' : ''}`}
            onClick={() => setFilterType(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionFilters;
