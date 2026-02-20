import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App' // Adjust path if necessary in your repo

describe('Frontend smoke test', () => {
  it('renders the app without crashing', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    // Basic check: ensure root element exists
    const root = screen.getByTestId('root') || document.body
    expect(root).toBeTruthy()
  })
})
