import React, { useState } from 'react';

interface DataTableProps {
  columns: Record<string, string>;
  data: Array<Record<string, any>>;
  hiddenColumns?: string[];
}

export function DataTable({ columns, data, hiddenColumns = [] }: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const isHidden = (column: string) => hiddenColumns.includes(column);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
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
                      <img src="/images/crossed-eye.svg" alt="Collapse" className="img-fluid" />
                    ) : (
                      <img src="/images/eye.svg" alt="Expand" className="img-fluid" />
                    )}
                  </button>
                  <button className="">
                    <img src="/images/edit.svg" alt="Edit" className="img-fluid" />
                  </button>
                  <button className="">
                    <img src="/images/delete.svg" alt="Delete" className="img-fluid" />
                  </button>
                </td>
              </tr>
              {expandedRow === rowIndex && hiddenColumns.length > 0 && (
                <tr className='expanded_tr'>
                  <td colSpan={Object.keys(columns).length + 2}>
                    <div className="d-flex flex-column">
                      {hiddenColumns.map((col) => (
                        <div key={col}>
                          <strong>{columns[col]}: </strong>
                          <span>{row[col]}</span>
                        </div>
                      ))}
                      <div>
                        <strong>Status: </strong>
                        <button
                          className={`btn btn-sm ${row.Status === 'active' ? 'btn-success' : 'btn-secondary'}`}
                          onClick={() => {
                            row.Status = row.Status === 'active' ? 'inactive' : 'active';
                            setExpandedRow(null); // Trigger re-render
                          }}
                        >
                          {row.Status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </div>
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
