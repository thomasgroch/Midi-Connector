import request from 'superagent'

const API_URL = `http://${process.env.APP_HOSTNAME}:${process.env.PORT}`

const backend = {
  fetchMidiConnections: () =>
    request
      .get(`${API_URL}/midi-devices`)
      .set('Content-Type', 'application/json'),

  createConnection: ({ sourceId, targetId }) => {
    const body = { sourceId, targetId }
    return request
      .post(`${API_URL}/connect`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
  },

  disconnectAll: () =>
    request
      .del(`${API_URL}/disconnect-all`)
      .set('Content-Type', 'application/json')
}

export default backend
