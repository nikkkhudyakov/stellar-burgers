import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { clearConstructor } from './constructor-slice';

type TCreateOrderState = {
  orderModalData: { number: number } | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TCreateOrderState = {
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[]) => orderBurgerApi(ingredientsIds)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = { number: action.payload.order.number };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(clearConstructor, (state) => {
        if (state.orderModalData) {
          return;
        }
        state.orderRequest = false;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
