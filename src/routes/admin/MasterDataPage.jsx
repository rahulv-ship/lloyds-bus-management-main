import { useEffect, useCallback, useState } from 'react'
import api from '../../services/api'
import AlertModal from '../../components/common/AlertModal'
import Button from '../../components/common/Button'
import { Trash2, Pencil } from 'lucide-react'
import './MasterDataPage.css'

const CONFIG = {
  buses: ['bus_number', 'registration_number', 'seating_capacity', 'status'],
  routes: ['route_number', 'route_name', 'source', 'destination', 'status'],
  stops: ['stop_code', 'stop_name', 'status'],
  shifts: ['shift_code', 'shift_name', 'start_time', 'end_time', 'status'],
  vendors: ['vendor_code', 'vendor_name', 'mobile', 'status'],
  drivers: ['driver_code', 'driver_name', 'mobile', 'status'],
  conductors: ['conductor_code', 'conductor_name', 'mobile', 'status'],
  'bus-routes': ['bus_id', 'route_id', 'shift_id', 'employee_capacity', 'status'],
}

const label = (x) =>
  x
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const emptyForm = (fields) => {
  const form = {}
  fields.forEach((f) => {
    form[f] = ''
  })
  return form
}

export default function MasterDataPage() {
  const [entity, setEntity] = useState('buses')
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [alert, setAlert] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingRow, setPendingRow] = useState(null)

  useEffect(() => {
    if (notice) setAlert(notice)
  }, [notice])

  const fields = CONFIG[entity] || []

  const load = useCallback(() => {
    setNotice('')
    api
      .get(`/admin/master/${entity}`)
      .then((r) => setRows(Array.isArray(r.data?.data) ? r.data.data : []))
      .catch((e) => {
        setRows([])
        setNotice(e.response?.data?.message || e.message)
      })
  }, [entity])

  useEffect(() => {
    load()
  }, [load])

  const handleEntityChange = (nextEntity) => {
    setEntity(nextEntity)
    setForm(emptyForm(CONFIG[nextEntity] || []))
    setEditingId(null)
    setNotice('')
  }

  const startEdit = (row) => {
    setEditingId(row.id)
    const next = {}
    fields.forEach((f) => {
      next[f] = row[f] ?? ''
    })
    setForm(next)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm(fields))
  }

  const save = async (e) => {
    e.preventDefault()
    const isEdit = editingId !== null
    const payload = { ...form }

    if (entity === 'buses' && payload.status === '') {
      payload.status = 'ACTIVE'
    }

    try {
      if (isEdit) {
        await api.put(`/admin/master/${entity}/${editingId}`, payload)
        setNotice('Master record updated.')
        setEditingId(null)
      } else {
        await api.post(`/admin/master/${entity}`, payload)
        setNotice('Master record added.')
      }
      setForm(emptyForm(fields))
      load()
    } catch (err) {
      setNotice(err.response?.data?.message || err.message)
    }
  }

  const remove = async (row) => {
    setPendingRow(row)
    setConfirmOpen(true)
  }

  const confirmRemove = async () => {
    setConfirmOpen(false)
    if (!pendingRow) return
    const row = pendingRow
    setPendingRow(null)
    try {
      await api.delete(`/admin/master/${entity}/${row.id}`)
      setNotice('Master record deleted.')
      if (editingId === row.id) {
        setEditingId(null)
        setForm(emptyForm(fields))
      }
      load()
    } catch (err) {
      setNotice(err.response?.data?.message || err.message)
    }
  }

  const cancelRemove = () => {
    setConfirmOpen(false)
    setPendingRow(null)
  }

  const isEditMode = editingId !== null

  return (
    <div className="stack">
      <div>
        <h1>Master data management</h1>
        <p>Maintain fleet, routes, stops, shifts and transport staff.</p>
      </div>

      {notice && <AlertModal open={Boolean(notice)} title="Close box" message={notice} confirmLabel="Close" onConfirm={() => setNotice('')} />}

      <AlertModal
        open={confirmOpen}
        title="Delete record"
        message={`Delete this ${label(entity).slice(0, -1)} record? This cannot be undone.`}
        tone="danger"
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />

      <div className="card">
        <label className="field">
          <span className="field__label">Master data type</span>
          <select value={entity} onChange={(e) => handleEntityChange(e.target.value)}>
            {Object.keys(CONFIG).map((x) => (
              <option key={x} value={x}>
                {label(x)}
              </option>
            ))}
          </select>
        </label>

        <form className="admin-master-form" onSubmit={save}>
          {fields.map((f) => (
            <label className="field" key={f}>
              <span className="field__label">{label(f)}</span>
              {f === 'status' ? (
                <select
                  value={form[f] || 'ACTIVE'}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                >
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                  {entity === 'buses' && (
                    <>
                      <option>BREAKDOWN</option>
                      <option>UNDER_MAINTENANCE</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  value={form[f] || ''}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              )}
            </label>
          ))}
          <div className="admin-master-form__actions">
            <Button type="submit">{isEditMode ? 'Update record' : 'Add record'}</Button>
            {isEditMode && (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>{label(entity)}</h2>
        <div className="admin-master-table">
          <table>
            <thead>
              <tr>
                {fields.map((f) => (
                  <th key={f}>{label(f)}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {fields.map((f) => (
                    <td key={f}>{row[f] ?? '—'}</td>
                  ))}
                  <td>
                    <div className="admin-master-actions">
                      <button
                        type="button"
                        className="admin-master-edit"
                        onClick={() => startEdit(row)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-master-delete"
                        onClick={() => remove(row)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={fields.length + 1} className="admin-master-empty">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
