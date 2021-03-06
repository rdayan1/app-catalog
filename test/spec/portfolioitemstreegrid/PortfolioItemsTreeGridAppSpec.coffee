Ext = window.Ext4 || window.Ext

Ext.require [
  'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp',
  'Ext.state.Manager',
  'Rally.data.util.PortfolioItemTypeDefList'
]

describe 'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', ->

  helpers
    createApp: ->
      context = Ext.create 'Rally.app.Context',
        initialValues:
          project: Rally.environment.getContext().getProject()
          workspace: Rally.environment.getContext().getWorkspace()
          user: Rally.environment.getContext().getUser()
          subscription: Rally.environment.getContext().getSubscription()

      context.isFeatureEnabled = -> true

      Ext.create 'Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp',
        context: context
        renderTo: 'testDiv'

    renderApp: ->
      @app = @createApp()
      @waitForComponentReady @app

  beforeEach ->
    @piHelper = new Helpers.PortfolioItemGridBoardHelper @
    @piHelper.stubPortfolioItemRequests()

  afterEach ->
    _.invoke Ext.ComponentQuery.query('portfoliotemstreegridapp'), 'destroy'

  it 'should initialize', ->
    @renderApp().then =>
      expect(Ext.isDefined(@app)).toBeTruthy()

  it 'should use the row expansion plugin', ->
    @renderApp().then =>
      plugins = _.map @app.gridboard.gridConfig.plugins, (plugin) -> plugin.ptype || plugin
      expect(plugins).toContain 'rallytreegridexpandedrowpersistence'

  it 'should configure the tree store to the portfolio item types', ->
    @renderApp().then =>
      storeTypes = _.pluck(@app.gridboard.gridConfig.store.models, 'elementName')
      piTypes = _.pluck(@piTypes, 'Name')
      expect(_.intersection(storeTypes, piTypes)).toEqual piTypes
