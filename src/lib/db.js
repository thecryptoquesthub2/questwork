const DATABASE_URL = import.meta.env.VITE_DATABASE_URL

export async function query(queryText, params = []) {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(DATABASE_URL)
    const result = await sql(queryText, params)
    return result
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export default { query }