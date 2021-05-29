import axios from 'utils/axios';
import { Analytics, AnalyticsShowRequest } from 'types';

const analyticsService = {
  show: async (params: AnalyticsShowRequest): Promise<Analytics> => {
    try {
      const response = await axios.get('/api/analysis', {
        params: {
          ...params,
        },
      });
      if (response.status === 200) {
        return await Promise.resolve(response.data);
      }
      return await Promise.reject(Error(response.data.message));
    } catch (e) {
      return Promise.reject(Error('网络故障，请检查您的网络'));
    }
  },
};

export default analyticsService;
