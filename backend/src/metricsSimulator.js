// Genera un número aleatorio entre min y max
const random = (min, max) => Math.random() * (max - min) + min

// Estado interno para simular tendencias realistas
let state = {
  users: 1200,
  revenue: 45000,
  orders: 340,
  conversionRate: 3.2,
}

// Actualiza el estado gradualmente (no salta de golpe)
function updateState() {
  state.users       = Math.max(800,  state.users       + random(-20, 25))
  state.revenue     = Math.max(0,    state.revenue     + random(-500, 800))
  state.orders      = Math.max(100,  state.orders      + random(-5, 10))
  state.conversionRate = Math.min(10, Math.max(1, state.conversionRate + random(-0.2, 0.2)))
}

// Genera un snapshot completo de métricas
function generateMetrics() {
  updateState()

  return {
    timestamp: new Date().toISOString(),
    kpis: {
      activeUsers:     Math.round(state.users),
      revenue:         parseFloat(state.revenue.toFixed(2)),
      orders:          Math.round(state.orders),
      conversionRate:  parseFloat(state.conversionRate.toFixed(2)),
    },
    chart: {
      cpu:     parseFloat(random(20, 85).toFixed(1)),
      memory:  parseFloat(random(40, 90).toFixed(1)),
      network: parseFloat(random(10, 70).toFixed(1)),
    },
    table: generateTableRow(),
  }
}

// Genera una fila de transacción aleatoria
function generateTableRow() {
  const products = ['Plan Pro', 'Plan Basic', 'Plan Enterprise', 'Add-on Storage', 'Add-on API']
  const statuses = ['completed', 'pending', 'failed']
  const countries = ['Ecuador', 'México', 'Colombia', 'Argentina', 'Chile']

  return {
    id:      Math.random().toString(36).substring(2, 9).toUpperCase(),
    product: products[Math.floor(random(0, products.length))],
    amount:  parseFloat(random(9.99, 499.99).toFixed(2)),
    status:  statuses[Math.floor(random(0, statuses.length))],
    country: countries[Math.floor(random(0, countries.length))],
    date:    new Date().toISOString(),
  }
}

module.exports = { generateMetrics }