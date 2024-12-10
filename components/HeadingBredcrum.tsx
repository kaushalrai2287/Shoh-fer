import React from 'react';

interface Breadcrumb {
  active: boolean;
  link?: string;
  label: React.ReactNode; // Can be string, number, or React element
}

interface HeadingBredcrumProps {
  heading: string;
  breadcrumbs: Breadcrumb[];
}

const HeadingBredcrum: React.FC<HeadingBredcrumProps> = ({ heading, breadcrumbs }) => {
  return (
    <main className="heading_breadcrum_mainbox">
      <div className="heading_bredcrum_box">
        <div className="inner_main_heading">
          <h1>{heading}</h1>
        </div>
        <div className="breadcrum_box">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {breadcrumbs.map((breadcrumb, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item ${breadcrumb.active ? 'active' : ''}`}
                  aria-current={breadcrumb.active ? 'page' : undefined}
                >
                  {!breadcrumb.active ? (
                    <a href={breadcrumb.link}>{breadcrumb.label}</a>
                  ) : (
                    breadcrumb.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default HeadingBredcrum;
