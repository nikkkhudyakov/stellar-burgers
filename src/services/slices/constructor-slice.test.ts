import reducer, {
  addIngredient,
  moveIngredientUp,
  removeIngredient
} from './constructor-slice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

describe('burgerConstructor slice', () => {
  const bunIngredient: TIngredient = {
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
  };

  const mainIngredient: TIngredient = {
    _id: 'main-1',
    name: 'Котлета',
    type: 'main',
    proteins: 25,
    fat: 18,
    carbohydrates: 4,
    calories: 250,
    price: 150,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  };

  it('обрабатывает добавление ингредиента', () => {
    const stateWithBun = reducer(undefined, addIngredient(bunIngredient));
    const nextState = reducer(stateWithBun, addIngredient(mainIngredient));

    expect(nextState.bun?._id).toBe('bun-1');
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject({
      _id: 'main-1',
      name: 'Котлета',
      type: 'main'
    });
    expect(nextState.ingredients[0].id).toEqual(expect.any(String));
  });

  it('обрабатывает удаление ингредиента', () => {
    const ingredientToRemove: TConstructorIngredient = {
      ...mainIngredient,
      id: 'constructor-item-1'
    };
    const ingredientToKeep: TConstructorIngredient = {
      ...mainIngredient,
      _id: 'main-2',
      name: 'Котлета 2',
      id: 'constructor-item-2'
    };

    const state = {
      bun: bunIngredient,
      ingredients: [ingredientToRemove, ingredientToKeep]
    };

    const nextState = reducer(state, removeIngredient('constructor-item-1'));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('constructor-item-2');
  });

  it('обрабатывает изменение порядка ингредиентов в начинке', () => {
    const firstIngredient: TConstructorIngredient = {
      ...mainIngredient,
      id: 'item-1'
    };
    const secondIngredient: TConstructorIngredient = {
      ...mainIngredient,
      _id: 'main-2',
      name: 'Котлета 2',
      id: 'item-2'
    };

    const state = {
      bun: bunIngredient,
      ingredients: [firstIngredient, secondIngredient]
    };

    const nextState = reducer(state, moveIngredientUp(1));

    expect(nextState.ingredients[0].id).toBe('item-2');
    expect(nextState.ingredients[1].id).toBe('item-1');
  });
});
