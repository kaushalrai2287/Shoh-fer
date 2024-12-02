"use client";
import React from 'react'
import Link from "next/link";

const Sidemenu = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <main className="sidemenu_main">
      <div className="sidemenu_mainbox">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/dashboard.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Dashboard</h3>
              </div>
            </div>
          </Link>
          <div className="accordion-item">
            <div className="accordion-header" id="flush-headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                <div className="sidemenu_listing">
                  <div className="sidemenu_icon">
                    <img src="/images/dashboard/service-center.svg" alt="" className="img-fluid" />
                  </div>
                  <div className="sidemenu_heading">
                    <h3>Service Centers</h3>
                  </div>
                </div>
              </button>
            </div>
            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="sidemunu_submenu_listing">
                  <ul>
                    <li><Link href="/add-service-center/index">Manage Service Centers</Link></li>
                    <li><Link href="">Billing & Payments</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <div className="accordion-header" id="flush-headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                <div className="sidemenu_listing">
                  <div className="sidemenu_icon">
                    <img src="/images/dashboard/drivers.svg" alt="" className="img-fluid" />
                  </div>
                  <div className="sidemenu_heading">
                    <h3>Drivers</h3>
                  </div>
                </div>
              </button>
            </div>
            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="sidemunu_submenu_listing">
                  <ul>
                    <li><Link href="/drivers/manage-drivers">Manage Drivers</Link></li>
                    <li><Link href="/drivers/driver-payments">Driver Payments</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <div className="accordion-header" id="flush-headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                <div className="sidemenu_listing">
                  <div className="sidemenu_icon">
                    <img src="/images/dashboard/booking.svg" alt="" className="img-fluid" />
                  </div>
                  <div className="sidemenu_heading">
                    <h3>Bookings</h3>
                  </div>
                </div>
              </button>
            </div>
            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="sidemunu_submenu_listing">
                  <ul>
                    <li><Link href="">Manage Bookings</Link></li>
                    <li><Link href="">Driver Assignments</Link></li>
                    <li><Link href="">Tracking</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <div className="accordion-header" id="flush-headingFour">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                <div className="sidemenu_listing">
                  <div className="sidemenu_icon">
                    <img src="/images/dashboard/roles-permissions.svg" alt="" className="img-fluid" />
                  </div>
                  <div className="sidemenu_heading">
                    <h3>Roles & Permissions</h3>
                  </div>
                </div>
              </button>
            </div>
            <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="sidemunu_submenu_listing">
                  <ul>
                    <li><Link href="/rolls-permission/list">Manage Roles</Link></li>
                    <li><Link href="">Assign Permissions</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/notification.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Notifications</h3>
              </div>
            </div>
          </Link>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/feedback-rating.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Feedback & Ratings</h3>
              </div>
            </div>
          </Link>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/Invoices.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Invoices</h3>
              </div>
            </div>
          </Link>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/documents.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Documents</h3>
              </div>
            </div>
          </Link>
          <div className="accordion-item">
            <div className="accordion-header" id="flush-headingFive">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                <div className="sidemenu_listing">
                  <div className="sidemenu_icon">
                    <img src="/images/dashboard/settings.svg" alt="" className="img-fluid" />
                  </div>
                  <div className="sidemenu_heading">
                    <h3>Settings</h3>
                  </div>
                </div>
              </button>
            </div>
            <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="sidemunu_submenu_listing">
                  <ul>
                    <li><Link href="/">System Settings</Link></li>
                    <li><Link href="">Rate Settings</Link></li>
                    <li><Link href="">Tracking Settings</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/miscellaneous.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Miscellaneous/ Category management</h3>
              </div>
            </div>
          </Link>
          <Link href="">
            <div className="sidemenu_listing">
              <div className="sidemenu_icon">
                <img src="/images/dashboard/reports.svg" alt="" className="img-fluid" />
              </div>
              <div className="sidemenu_heading">
                <h3>Reports</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="toggle-button" onClick={onToggle}>
        <img src="/images/angle-small-left.svg" alt="" className="img-fluid" />
      </div>
    </main>
  )
}

export default Sidemenu