import api from './api'

export const aiService = {
  // Meta
  getAllMeta:          () => api.get('/api/predictions/meta'),
  getModelMeta:       (name: string) => api.get(`/api/predictions/meta/${name}`),
  getHistory:         (limit = 50, model?: string) =>
    api.get('/api/predictions/history', { params: { limit, model } }),

  // 15 prediction endpoints
  predictDelay:       (d: object) => api.post('/api/predictions/delay', d),
  predictPrice:       (d: object) => api.post('/api/predictions/price', d),
  predictNoShow:      (d: object) => api.post('/api/predictions/no-show', d),
  predictCancellation:(d: object) => api.post('/api/predictions/cancellation', d),
  predictSatisfaction:(d: object) => api.post('/api/predictions/satisfaction', d),
  predictAirlineRec:  (d: object) => api.post('/api/predictions/airline-recommendation', d),
  predictTravelRec:   (d: object) => api.post('/api/predictions/travel-recommendation', d),
  predictSentiment:   (d: object) => api.post('/api/predictions/sentiment', d),
  predictChatbot:     (d: object) => api.post('/api/predictions/chatbot', d),
  predictMaintenance: (d: object) => api.post('/api/predictions/maintenance', d),
  predictWeather:     (d: object) => api.post('/api/predictions/weather', d),
  predictRoute:       (d: object) => api.post('/api/predictions/route', d),
  predictFuel:        (d: object) => api.post('/api/predictions/fuel', d),
  predictCarbon:      (d: object) => api.post('/api/predictions/carbon', d),
  predictCongestion:  (d: object) => api.post('/api/predictions/congestion', d),
}
