'use client'
import React from 'react'
import type { UIFieldClientComponent } from 'payload'

const DownloadTemplateButton: UIFieldClientComponent = () => {
  // You can access field props if needed via the component props
  return (
    <div
      style={{
        padding: '16px',
        border: '1px solid #e1e5e9',
        borderRadius: '6px',
        backgroundColor: '#f9fafb',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>📥 Download Speaker Template</h4>
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        Download an Excel template to bulk upload speakers
      </p>
      <a
        href="/api/speakers/download-template"
        download="speakers-template.xlsx"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        📥 Download Template
      </a>
    </div>
  )
}

export default DownloadTemplateButton
