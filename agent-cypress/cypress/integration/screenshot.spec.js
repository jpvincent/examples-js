const viewports = require( '../fixtures/vrt-viewports.json')
const target_paths = require(`../fixtures/vrt-page-path_${Cypress.env('PROJECT')}.json`)

// on ignore toutes les erreurs JS qui viennent de notre code
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

describe("Test", () => {

    before(() => {
        cy.vrtStart()
/*        cy.fixture(`vrt-page-path_${Cypress.env('PROJECT')}.json`).then((paths) => {
        target_paths = paths
        })*/

        const emptyHTTPResponse = {body:'', statusCode:204}
        cy.intercept({hostname:'cdn.tagcommander.com'}, emptyHTTPResponse)
        cy.intercept({hostname:'h8w6wsacjs.kameleoon.eu'}, emptyHTTPResponse)
        cy.intercept({hostname:'ws.facil-iti.com'}, emptyHTTPResponse)
        cy.intercept({hostname:'web-engagement.maif.fr'}, emptyHTTPResponse)
        cy.intercept({hostname:'www.googleadservices.com'}, emptyHTTPResponse)
        cy.intercept({hostname:'cobrowse.maif.fr'}, emptyHTTPResponse)

    });
    beforeEach(()=> {
        // MAIF cookie acceptation
        cy.setCookie('TC_PRIVACY', '0@001@4%2C5%2C6@@1609167087336@')

    })
    after(() => {
        cy.vrtStop()
    });

    describe("Visual Regression Tracker", () => {

        Object.keys(viewports).forEach((viewport) => {
            Object.keys(target_paths).forEach((page) => {
                it(`VRT Test for ${viewport} - page ${page}`, function() {
                    cy.viewport(viewports[viewport].viewportWidth, viewports[viewport].viewportHeight)
                    cy.log(Cypress.config("viewportHeight"))
                    cy.visit(target_paths[page])
                    return cy.screenshot(`${Cypress.env('PROJECT')}_${page}-${viewport}`)
                })

            })
        })
    })
})
