Ext = window.Ext4 || window.Ext

Ext.require [
  'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp'
]

describe 'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', ->

  helpers
    getPiTreeGridAppConfig: (featureEnabled) ->
      defaultSettings:
        modelNames: ['PortfolioItem/Initiative']
      getHeight: -> 250
      getContext: ->
        get: ->
        isFeatureEnabled: -> featureEnabled
        getScopedStateId: -> 'someStateId'
        getWorkspace: ->
          WorkspaceConfiguration:
            DragDropRankingEnabled: true

  beforeEach ->
    @ajax.whenReading("project", 431439).respondWith _ref: "/project/431439"
    @ajax.whenQueryingEndpoint('schema').respondWith Rally.test.mock.data.types.v2_x.Schema.getSchemaResults()
    @ajax.whenQuerying('TypeDefinition').respondWith()
    initiative = @mom.getRecord('PortfolioItem/Initiative')
    @ajax.whenQuerying('PortfolioItem/Initiative').respondWith [initiative.data]
    @ajax.whenQuerying('artifact').respondWith()

  afterEach ->
    _.invoke Ext.ComponentQuery.query('portfoliotemstreegridapp'), 'destroy'

  it 'should initialize', ->
    piTreeGridApp = Ext.create 'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', @getPiTreeGridAppConfig(false)
    expect(Ext.isDefined(piTreeGridApp)).toBeTruthy()

  it 'should add the GridBoardFieldPicker to the grid\'s plugins', ->
    piTreeGridApp = Ext.create 'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', @getPiTreeGridAppConfig(true)
    piTreeGridApp.fireEvent('afterrender')

    gridConfig = piTreeGridApp.down('#gridBoard')
    gridPlugins = gridConfig.plugins

    expect(gridPlugins).not.toBeNull
    expect(gridPlugins.length).toBeGreaterThan 0
    expect(_.find(gridPlugins, (plugin)->
        plugin.ptype == 'rallygridboardfieldpicker')).toBeTruthy()

