import React, { useState } from 'react';

interface DataTableProps {
  columns: Record<string, string>;
  data: Array<Record<string, any>>;
  hiddenColumns?: string[];
  showRequestButton?: boolean;
  showStatusButton?: boolean;
  toggleStatus?: (row: any) => void; // Callback for status change
  showBillingButton?: boolean;
  toggleRequest?: (row: any) => void; // Callback for request change
  toggleBilling?: (row: any) => void; // Callback for billing change
}

export function DataTable({
  columns,
  data,
  hiddenColumns = [],
  showRequestButton = false,
  showStatusButton = false,
  showBillingButton = false,
  toggleStatus,
  toggleRequest,
  toggleBilling
}: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const isHidden = (column: string) => hiddenColumns.includes(column);

  const handleStatusChange = (row: any) => {
    if (toggleStatus) {
      toggleStatus(row); // Call toggleStatus handler passed from parent
    }
    setExpandedRow(null); // Close expanded row after status change
  };

  const handleRequestChange = (row: any) => {
    if (toggleRequest) {
      toggleRequest(row); // Call toggleRequest handler passed from parent
    }
    setExpandedRow(null); // Close expanded row after request change
  };

  const handleBillingChange = (row: any) => {
    if (toggleBilling) {
      toggleBilling(row); // Call toggleBilling handler passed from parent
    }
    setExpandedRow(null); // Close expanded row after billing change
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            {Object.keys(columns).map(
              (colKey, index) =>
                !isHidden(colKey) && <th key={index}>{columns[colKey]}</th>
            )}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr>
                <td>{rowIndex + 1}</td>
                {Object.keys(columns).map(
                  (colKey, colIndex) =>
                    !isHidden(colKey) && <td key={colIndex}>{row[colKey]}</td>
                )}
                <td className="action_btns">
                  <button
                    className=""
                    onClick={() => setExpandedRow(expandedRow === rowIndex ? null : rowIndex)}
                  >
                    {expandedRow === rowIndex ? (
                      <img src="/images/crossed-eye.svg" alt="Collapse" title="Hide Details" className="img-fluid" />
                    ) : (
                      <img src="/images/eye.svg" alt="Expand" title="Show Details" className="img-fluid" />
                    )}
                  </button>
                  {/* Dynamic Edit Button */}
                  {row.onEdit && (
                    <button className="" onClick={row.onEdit}>
                      <img
                        src="/images/edit.svg"
                        alt="Edit"
                        title="Edit"
                        className="img-fluid"
                      />
                    </button>
                  )}
                  {row.onDelete && (
                    <button className="" onClick={row.onDelete}>
                      <img
                        src="/images/delete.svg"
                        alt="Delete"
                        title="Delete"
                        className="img-fluid"
                      />
                    </button>
                  )}
                </td>
              </tr>
              {expandedRow === rowIndex && hiddenColumns.length > 0 && (
                <tr className="expanded_tr">
                  <td colSpan={Object.keys(columns).length + 2}>
                    <div className="d-flex flex-column">
                      {hiddenColumns.map((col) => (
                        <div key={col}>
                          <strong>{columns[col]}: </strong>
                          <span>{row[col]}</span>
                        </div>
                      ))}
                      {showStatusButton && (
                        <div>
                          <strong>Status: </strong>
                          <button
                            className={`btn btn-sm ${row.Status === 'Active' ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => {
                              row.Status = row.Status === 'Active' ? 'Inactive' : 'Active';
                              handleStatusChange(row); // Call handler to update status
                            }}
                          >
                            {row.Status === 'Active' ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      )}
                      {showRequestButton && (
                        <div>
                          <strong>Request: </strong>
                          <button
                            className={`btn btn-sm ${row.Request === 'Approved' ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => {
                              row.Request = row.Request === 'Approved' ? 'Reject' : 'Approved';
                              handleRequestChange(row); 
                            }}
                          >
                            {row.Request === 'Approved' ? 'Approved' : 'Reject'}
                          </button>
                        </div>
                      )}
                      {showBillingButton && (
                        <div>
                          <strong>Billing: </strong>
                          <button
                            className={`btn btn-sm ${row.Billing === 'Paid' ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => {
                              row.Billing = row.Billing === 'Paid' ? 'Pending' : 'Paid';
                              handleBillingChange(row); // Call handler to update billing
                            }}
                          >
                            {row.Billing === 'Paid' ? 'Paid' : 'Pending'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
