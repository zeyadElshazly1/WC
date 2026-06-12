import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://btugsfpljybavgjcicim.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dWdzZnBsanliYXZnamNpY2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTIwOTEsImV4cCI6MjA5Njc2ODA5MX0.GIAs6T-0kKIu2QKwFQc8FNrm1vTB0Pu8wBIprp469bI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── DB helpers ────────────────────────────────────────────────────────────────

export async function loadAll() {
  const [{ data: preds }, { data: res }, { data: plrs }] = await Promise.all([
    supabase.from('predictions').select('*'),
    supabase.from('results').select('*'),
    supabase.from('players').select('*').order('created_at'),
  ])

  // Shape predictions into { playerName: { fixtureId: { homeScore, awayScore, winner } } }
  const predictions = {}
  for (const row of preds || []) {
    if (!predictions[row.player]) predictions[row.player] = {}
    predictions[row.player][row.fixture_id] = {
      homeScore: row.home_score,
      awayScore: row.away_score,
      winner:    row.winner,
    }
  }

  // Shape results into { fixtureId: { homeScore, awayScore } }
  const results = {}
  for (const row of res || []) {
    results[row.fixture_id] = { homeScore: row.home_score, awayScore: row.away_score }
  }

  // Shape players into [{ name, pin }]
  const players = plrs && plrs.length > 0
    ? plrs.map(r => ({ name: r.name, pin: r.pin }))
    : null // null = use defaults

  return { predictions, results, players }
}

export async function savePrediction(player, fixtureId, { homeScore, awayScore, winner }) {
  await supabase.from('predictions').upsert({
    player,
    fixture_id: fixtureId,
    home_score: homeScore,
    away_score: awayScore,
    winner,
  }, { onConflict: 'player,fixture_id' })
}

export async function saveResult(fixtureId, { homeScore, awayScore }) {
  await supabase.from('results').upsert({
    fixture_id: fixtureId,
    home_score: homeScore,
    away_score: awayScore,
  }, { onConflict: 'fixture_id' })
}

export async function addPlayer({ name, pin }) {
  await supabase.from('players').upsert({ name, pin }, { onConflict: 'name' })
}

export async function seedDefaultPlayers(defaults) {
  // Only seeds if table is empty
  const { data } = await supabase.from('players').select('name').limit(1)
  if (data && data.length === 0) {
    await supabase.from('players').insert(defaults.map(p => ({ name: p.name, pin: p.pin })))
  }
}