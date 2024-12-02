import React, { useState } from 'react';

interface DataTableProps {
  columns: Record<string, string>;
  data: Array<Record<string, any>>;
  hiddenColumns?: string[];
  showRequestButton?: boolean;
  showStatusButton?: boolean;
  onStatusChange?: (row: any) => void;
  showBillingButton?: boolean;
}

export function DataTable({
  columns,
  data,
  hiddenColumns = [],
  showRequestButton = false, // Default is false
  showStatusButton = false,
  showBillingButton = false,
  onStatusChange,
}: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const isHidden = (column: string) => hiddenColumns.includes(column);

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
                            setExpandedRow(null); 
                          }}
                        >
                          {row.Status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      )}
                      {/* Request Button: Conditionally rendered */}
                      {showRequestButton && (
                        <div>
                          <strong>Request: </strong>
                          <button
                            className={`btn btn-sm ${row.Request === 'Approved' ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => {
                              row.Request = row.Request === 'Approved' ? 'Reject' : 'Approved';
                              setExpandedRow(null); // Trigger re-render
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
                              setExpandedRow(null); // Trigger re-render
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
