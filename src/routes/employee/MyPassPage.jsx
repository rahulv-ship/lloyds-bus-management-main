import { Link } from 'react-router-dom'
import { IdCard, Mail } from 'lucide-react'
import DigitalPassCard from '../../components/pass/DigitalPassCard'
import EmptyState from '../../components/common/EmptyState'
import { SkeletonCard } from '../../components/common/Skeleton'
import Button from '../../components/common/Button'
import { useApplications } from '../../hooks/useApplications'
import LiveMapPreview from '../../components/pass/LiveMapPreview'
import './MyPassPage.css'

export default function MyPassPage() {
  const { approved, loading, sendQRCodeEmail, notice } = useApplications()

  const handleSendQR = async () => {
    if (!approved?.id) return
    await sendQRCodeEmail(approved.id)
  }

  return (
    <div className="stack">
      <h2>My Pass</h2>

      {loading && <SkeletonCard lines={5} />}

      {!loading && !approved && (
        <div className="card">
          <EmptyState
            icon={IdCard}
            title="No active pass"
            message="Your digital pass appears here once a bus pass application is approved."
            action={
              <Link to="/app/book">
                <Button variant="primary">Book your bus</Button>
              </Link>
            }
          />
        </div>
      )}

      {!loading && approved && (
        <>
          <div className="my-pass__grid">
            <DigitalPassCard app={approved} />
            <LiveMapPreview app={approved} />
          </div>
          <div className="my-pass__actions">
            <Button
              variant="secondary"
              icon={Mail}
              onClick={handleSendQR}
            >
              Send QR to Email
            </Button>
          </div>
          {notice && <p className="my-pass__notice">{notice}</p>}
        </>
      )}
    </div>
  )
}
