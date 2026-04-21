import './BudgetSummary.css';

const BUDGET_ITEMS = [
  { key: 'accommodation', label: 'Accommodation', icon: '🏨', color: 'var(--teal)' },
  { key: 'food', label: 'Food & Dining', icon: '🍤', color: 'var(--sunset-gold)' },
  { key: 'transport', label: 'Transport', icon: '🚗', color: 'var(--sunset-amber)' },
  { key: 'activities', label: 'Activities', icon: '🎭', color: 'var(--sunset-pink)' },
];

export default function BudgetSummary({ budget }) {
  if (!budget) return null;

  const total = budget.total || Object.values(budget).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return (
    <div className="budget-summary glass-card" id="budget-summary">
      <h3 className="budget-title">💰 Budget Breakdown</h3>

      <div className="budget-total">
        <span className="budget-total__label">Total Estimate</span>
        <span className="budget-total__value">₹{total.toLocaleString()}</span>
      </div>

      <div className="budget-items">
        {BUDGET_ITEMS.map(item => {
          const amount = budget[item.key] || 0;
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

          return (
            <div key={item.key} className="budget-item" id={`budget-item-${item.key}`}>
              <div className="budget-item__header">
                <div className="budget-item__left">
                  <span className="budget-item__icon">{item.icon}</span>
                  <span className="budget-item__label">{item.label}</span>
                </div>
                <div className="budget-item__right">
                  <span className="budget-item__pct" style={{ color: item.color }}>{pct}%</span>
                  <span className="budget-item__amount">₹{amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="budget-bar">
                <div
                  className="budget-bar__fill"
                  style={{
                    width: `${pct}%`,
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings tip */}
      <div className="budget-tip">
        💡 Rent a bike (₹400/day) instead of taxis to save ₹{Math.round(budget.transport * 0.4).toLocaleString()} on transport!
      </div>
    </div>
  );
}
