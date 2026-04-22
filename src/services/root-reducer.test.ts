import { rootReducer } from './root-reducer';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние для неизвестного экшена', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderModalData: null,
        orderRequest: false,
        error: null
      },
      orders: {
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
      },
      user: {
        user: null,
        isAuthenticated: false,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        updateUserError: null
      }
    });
  });
});
