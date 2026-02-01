import axios from 'axios'

export const vpnGateService = {
  getFreeConfigs() {
    // Fetch from the static JSON file in the public directory
    return axios.get('/free_configs.json')
  },
  
  importConfig(config) {
    // This would need a backend call if we wanted to save to DB, 
    // but the user wants "only and only in the frontend".
    // For now, we will just simulate a success or show an alert.
    return Promise.resolve({ data: { message: 'Import logic disabled for pure frontend' } })
  }
}
