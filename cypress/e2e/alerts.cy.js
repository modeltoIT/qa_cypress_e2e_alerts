import { faker } from '@faker-js/faker';

describe('Cypress application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have the ability to assert automatically resolved alerts', () => {
    const stub = cy.stub();
    Cypress.on('window:alert', stub);

    cy.get('#alertButton').click();
    cy.get('#alertButton').then(() => {
      expect(stub).to.be.calledWith('You clicked a button');
    });
  });

  it('should have the ability to assert scheduled alert', () => {
    const stub = cy.stub();
    Cypress.on('window:alert', stub);

    cy.clock();
    cy.get('#timerAlertButton').click();
    cy.get('#timerAlertButton').then(() => cy.tick(5000))
      .then(() => {
        expect(stub).to.be.calledWith('This alert appeared after 5 seconds');
      });
  });

  it('should automatically resolve alerts', () => {
    const stub = cy.stub();
    Cypress.on('window:confirm', stub);

    cy.get('#confirmButton').click();
    cy.get('#confirmButton').then(() => {
      expect(stub).to.be.calledWith('Do you confirm action?');
      cy.get('#confirmResult').should('contain.text', 'You selected Ok');
    });
  });

  it('should have the ability to Cancel alerts', () => {
    const stub = cy.stub().returns(false);
    Cypress.on('window:confirm', stub);

    cy.get('#confirmButton').click();
    cy.get('#confirmButton').then(() => {
      expect(stub).to.be.calledWith('Do you confirm action?');
      cy.get('#confirmResult').should('contain.text', 'You selected Cancel');
    });
  });

  it('should have the ability to enter text into prompt', () => {
    const firstName = faker.person.firstName();

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(firstName);
    });

    cy.get('#promtButton').click();
    cy.get('#promtButton').then(() => {
      cy.get('#promptResult').should('contain.text', `You entered ${firstName}`);
    });
  });
});
