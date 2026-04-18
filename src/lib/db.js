const API_URL = 'https://questwork.up.railway.app'

export async function getGigs() {
  const res = await fetch(`${API_URL}/api/gigs`)
  return res.json()
}

export async function postGig(data) {
  const res = await fetch(`${API_URL}/api/gigs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function postApplication(data) {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}