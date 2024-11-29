"use client";
import React from 'react'

const Sidemenu = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <main className="sidemenu_main">
      <h1>Sidebar</h1>
      <div className="toggle-button" onClick={onToggle}>
        <img src="/images/angle-small-left.svg" alt="" className="img-fluid" />
      </div>
    </main>
  )
}

export default Sidemenu