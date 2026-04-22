import reducer, { fetchIngredients } from './ingredients-slice';
import { TIngredient } from '../../utils/types';

describe('ingredients slice', () => {
  const ingredients: TIngredient[] = [
    {
      _id: 'bun-1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'bun.png',
      image_large: 'bun-large.png',
      image_mobile: 'bun-mobile.png'
    }
  ];

  it('устанавливает isLoading=true при экшене запроса', () => {
    const nextState = reducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('сохраняет данные и выключает загрузку при успешном ответе', () => {
    const loadingState = reducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    const nextState = reducer(
      loadingState,
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.items).toEqual(ingredients);
    expect(nextState.error).toBeNull();
  });

  it('сохраняет ошибку и выключает загрузку при ошибке запроса', () => {
    const loadingState = reducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    const nextState = reducer(
      loadingState,
      fetchIngredients.rejected(new Error('Ошибка сети'), 'request-id', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Ошибка сети');
  });
});
