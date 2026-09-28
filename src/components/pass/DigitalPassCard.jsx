import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Bus, MapPin, ShieldCheck } from 'lucide-react'
import { formatDate } from '../../utils/format'
import './DigitalPassCard.css'

const VERSION = 'v1'

function toBase64Url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromBase64Url(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad
  return decodeURIComponent(escape(atob(b64)))
}

/* ---------- Normalize any API shape into a known shape ---------- */

function normalizeApp(raw) {
  if (!raw) return null

  const emp = raw.employee || raw.user || {}
  const route = raw.route || raw.busRoute || {}
  const bus = raw.bus || raw.vehicle || {}
  const shift = raw.shift || {}
  const pickup = raw.pickupStop || raw.pickup_stop_obj || {}
  const drop = raw.dropStop || raw.drop_stop_obj || {}

  return {
    token:
      raw.qr_token ||
      raw.qrToken ||
      raw.qr_code ||
      raw.qrCode ||
      raw.pass_token ||
      raw.passToken ||
      raw.token ||
      raw.application?.qr_token ||
      null,

    passNumber:
      raw.pass_number || raw.passNumber || raw.pass_no || raw.number || null,

    employeeName:
      emp.employee_name || emp.name || raw.emp_name || raw.employee_name || null,

    employeeCode:
      emp.employee_code ||
      emp.code ||
      emp.employee_id ||
      emp.id ||
      raw.emp_code ||
      raw.employee_code ||
      null,

    department:
      emp.department ||
      emp.departmentName ||
      raw.department ||
      raw.departmentName ||
      raw.dept ||
      null,

    routeNumber:
      route.route_number || route.route_no || route.number || raw.route_no || null,

    routeName:
      route.route_name || route.name || raw.route_name || null,

    busNumber:
      bus.bus_number || bus.number || raw.bus_no || raw.bus_number || null,

    shiftName:
      shift.shift_name || shift.name || raw.shift_name || null,

    pickupName:
      pickup.stop_name ||
      pickup.name ||
      raw.pickup_stop ||
      raw.pickupStopName ||
      raw.pickup ||
      null,

    dropName:
      drop.stop_name ||
      drop.name ||
      raw.drop_stop ||
      raw.dropStopName ||
      raw.drop ||
      'Plant',

    validFrom:
      raw.pass_valid_from || raw.valid_from || raw.validFrom || raw.valid_from_date || null,

    validTo:
      raw.pass_valid_to || raw.valid_to || raw.validTo || raw.valid_to_date || null,
  }
}

function buildPassPayload(n) {
  if (!n || !n.token) return null

  const payload = {
    t: n.token,
    p: n.passNumber,
    n: n.employeeName,
    e: n.employeeCode,
    d: n.department,
    r: n.routeNumber,
    rn: n.routeName,
    b: n.busNumber,
    s: n.shiftName,
    pu: n.pickupName,
    dr: n.dropName,
    vf: n.validFrom,
    vt: n.validTo,
    ts: new Date().toISOString(),
  }

  return `BUSPASS:${VERSION}:${toBase64Url(JSON.stringify(payload))}`
}

export function parsePassPayload(raw) {
  if (!raw || typeof raw !== 'string') return null
  if (!raw.startsWith('BUSPASS:')) return null

  const [, version, b64] = raw.split(':')
  if (version !== VERSION || !b64) return null

  try {
    return JSON.parse(fromBase64Url(b64))
  } catch {
    return null
  }
}

export const PASS_FIELD_LABELS = {
  t: 'Token',
  p: 'Pass number',
  n: 'Employee',
  e: 'Employee ID',
  d: 'Department',
  r: 'Route number',
  rn: 'Route name',
  b: 'Bus',
  s: 'Shift',
  pu: 'Pickup',
  dr: 'Destination',
  vf: 'Valid from',
  vt: 'Valid to',
  ts: 'Generated at',
}

/* =========================================================
   Component
   ========================================================= */

export default function DigitalPassCard({ app: rawApp }) {
  const [qr, setQr] = useState('')
  const [qrError, setQrError] = useState(false)

  const app = normalizeApp(rawApp)

  useEffect(() => {
    if (!app) return

    const payload = buildPassPayload(app)

    // TEMP DEBUG — remove once verified
    console.log('[DigitalPassCard] normalized:', app)
    console.log('[DigitalPassCard] payload preview:', payload?.slice(0, 100))

    if (!payload) {
      console.warn('[DigitalPassCard] Missing token. Raw app keys:', rawApp && Object.keys(rawApp))
      setQr('')
      setQrError(true)
      return
    }

    let cancelled = false

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 320,
      errorCorrectionLevel: 'H',
      color: { dark: '#0f2a3d', light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (!cancelled) {
          setQr(dataUrl)
          setQrError(false)
        }
      })
      .catch((err) => {
        console.error('[DigitalPassCard] QR generation failed:', err)
        if (!cancelled) {
          setQr('')
          setQrError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [app])

  if (!app) return null

  return (
    <div className="pass-card">
      <div className="pass-card__perforation" aria-hidden="true" />

      <div className="pass-card__top">
        <div>
          <img
            className="pass-card__logo"
            src="/lloyds-metals-logo.png"
            alt="Lloyds Metals & Energy"
          />
          <h2 className="pass-card__title">Employee Bus Pass</h2>
        </div>
        <div className="pass-card__route-dots" aria-hidden="true">
          <MapPin size={14} />
        </div>
      </div>

      <div className="pass-card__number font-mono">{app.passNumber}</div>

      <div className="pass-card__body">
        <div className="pass-card__details">
          <Detail label="Employee" value={app.employeeName} />
          <Detail label="Employee ID" value={app.employeeCode} />
          <Detail label="Department" value={app.department} />
          <Detail
            label="Route"
            value={`${app.routeNumber || '—'} · ${app.routeName || '—'}`}
          />
          <Detail label="Bus" value={app.busNumber} />
          <Detail label="Shift" value={app.shiftName} />
          <Detail label="Pickup" value={app.pickupName} />
          <Detail label="Destination" value={app.dropName} />
        </div>

        <div className="pass-card__qr">
          {qr ? (
            <img
              src={qr}
              alt={`Boarding QR for ${app.employeeName || 'employee'}`}
              width={140}
              height={140}
            />
          ) : (
            <div className="pass-card__qr-placeholder" aria-hidden="true">
              {qrError && <span className="pass-card__qr-error">QR unavailable</span>}
            </div>
          )}
          <span className="pass-card__qr-hint">Scan to board</span>
          <span className="pass-card__qr-secure">
            <ShieldCheck size={10} aria-hidden="true" />
            Encrypted
          </span>
        </div>
      </div>

      <div className="pass-card__route-line" aria-hidden="true">
        <span />
        <Bus size={13} />
        <span />
      </div>

      <div className="pass-card__validity">
        Valid {formatDate(app.validFrom)} – {formatDate(app.validTo)}
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="pass-card__detail">
      <b>{label}</b>
      <span>{value || '—'}</span>
    </div>
  )
}