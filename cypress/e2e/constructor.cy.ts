describe('Страница конструктора бургера', () => {
  const setupApiMocks = () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');
  };

  beforeEach(() => {
    setupApiMocks();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.contains('li', 'Флюоресцентная булка R2-D3')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Биокотлета из марсианской Магнолии')
      .contains('button', 'Добавить')
      .click();

    cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
    cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('открывает модальное окно ингредиента и закрывает по крестику', () => {
    cy.contains('li', 'Соус Spicy-X').find('a').click();

    cy.contains('Детали ингредиента').should('exist');
    cy.contains('h3', 'Соус Spicy-X').should('exist');

    cy.contains('Детали ингредиента')
      .closest('div')
      .find('button')
      .first()
      .click();

    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('закрывает модальное окно ингредиента по оверлею', () => {
    cy.contains('li', 'Биокотлета из марсианской Магнолии').find('a').click();
    cy.contains('Детали ингредиента').should('exist');

    cy.get('#modals').children().last().click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('создает заказ и очищает конструктор после закрытия модального окна', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
        win.document.cookie = 'accessToken=mock-access-token';
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.contains('li', 'Флюоресцентная булка R2-D3')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Соус Spicy-X').contains('button', 'Добавить').click();

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains('12345').should('exist');
    cy.contains('идентификатор заказа').should('exist');

    cy.get('#modals svg').first().click({ force: true });
    cy.contains('идентификатор заказа').should('not.exist');

    cy.contains('Выберите булки').should('have.length.at.least', 1);
    cy.contains('Выберите начинку').should('exist');

    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
});
