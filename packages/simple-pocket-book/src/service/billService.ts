import axios from 'utils/axios';
import {
  BillIndexRequest,
  BillIndexResponse,
  BillCreateRequest,
  BillCreateResponse,
} from 'types';

const billService = {
  index: async ({
    page = 0,
    perPage = 10,
    ...params
  }: BillIndexRequest = {}): Promise<BillIndexResponse> => {
    try {
      const response = await axios.get('/api/bill', {
        params: {
          page,
          perPage,
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
  create: async (data: BillCreateRequest): Promise<BillCreateResponse> => {
    try {
      const response = await axios.post('/api/bill', {
        ...data,
      });
      if (response.status === 201) {
        return await Promise.resolve(response.data);
      }
      return await Promise.reject(Error(response.data.message));
    } catch (e) {
      return Promise.reject(Error('网络故障，请检查您的网络'));
    }
  },
};

export default billService;
