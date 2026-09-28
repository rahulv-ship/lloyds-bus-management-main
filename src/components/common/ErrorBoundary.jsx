import { Component } from 'react'
import Button from './Button'

export default class ScreenErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="login-screen">
          <section className="card" style={{ maxWidth: 420, textAlign: 'center' }}>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Unable to load dashboard</h1>
            <p style={{ marginBottom: 'var(--space-5)' }}>{this.state.error.message}</p>
            <Button
              variant="primary"
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
            >
              Clear session and sign in again
            </Button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
