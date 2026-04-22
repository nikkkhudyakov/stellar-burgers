import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TOrdersState = {
  feed: TOrdersData;
  profileOrders: TOrder[];
  currentOrder: TOrder | null;
  isLoadingFeed: boolean;
  isLoadingProfileOrders: boolean;
  isLoadingOrder: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  profileOrders: [],
  currentOrder: null,
  isLoadingFeed: false,
  isLoadingProfileOrders: false,
  isLoadingOrder: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () =>
  getFeedsApi()
);

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfileOrders',
  async () => getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] || null;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoadingFeed = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoadingFeed = false;
        state.feed = {
          orders: action.payload.orders,
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoadingFeed = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoadingProfileOrders = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoadingProfileOrders = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoadingProfileOrders = false;
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export default ordersSlice.reducer;
