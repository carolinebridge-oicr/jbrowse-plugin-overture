describe('Test the Overture plugin', () => {
  it('visits JBrowse', () => {
    cy.visit('/')

    // The splash screen successfully loads
    cy.contains('Start a new session')
  })

  it('opens the add track workflow', () => {
    cy.visit('/')
    cy.contains('Empty').click({ force: true })
    cy.contains('Launch view').click()
    cy.contains('Open').click()
    cy.contains('Open track selector').click()
    cy.get('[data-testid=MenuIcon]').eq(1).click()
    cy.contains('Add track...').click()
    cy.contains('Default add track workflow').click()
    cy.contains('Add Overture analysis tracks').click()
    cy.contains('Paste your configuration for your analysis/analyses:')
  })
})
