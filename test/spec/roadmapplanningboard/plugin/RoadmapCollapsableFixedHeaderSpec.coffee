Ext = window.Ext4 || window.Ext

Ext.require [
  'Rally.test.apps.roadmapplanningboard.helper.TestDependencyHelper'
  'Rally.apps.roadmapplanningboard.plugin.RoadmapCollapsableFixedHeader'
  'Rally.apps.roadmapplanningboard.PlanningBoard'
  'Rally.apps.roadmapplanningboard.AppModelFactory'
  'Rally.data.PreferenceManager'
]

describe 'Rally.apps.roadmapplanningboard.plugin.RoadmapCollapsableFixedHeader', ->

  helpers
    createCardboard: (config = {}) ->
      roadmapStore = Deft.Injector.resolve('roadmapStore')
      timelineStore = Deft.Injector.resolve('timelineStore')
      config = _.extend
        roadmap: roadmapStore.first()
        timeline: timelineStore.first()
        renderTo: 'testDiv'
        types: ['PortfolioItem/Feature']
        context: Rally.environment.getContext()
        plugins: [{ptype: 'rallyroadmapcollapsableheader'}]
        typeNames:
            child:
              name: 'Feature'
      , config

      @cardboard = Ext.create 'Rally.apps.roadmapplanningboard.PlanningBoard', config

      @waitForComponentReady(@cardboard)

    toggleExpansion: ->
      collapseStub = @stub()
      @cardboard.on 'headersizechanged', collapseStub
      @click(css: '.header-toggle-button').then =>
        @once
          condition: ->
            collapseStub.called

    getCollapsableHeaderElements: ->
      _.map(@cardboard.getEl().query('.roadmap-header-collapsable'), Ext.get)

    stubExpandStatePreference: (state = true) ->
      @stub Rally.data.PreferenceManager, 'load', ->
        deferred = new Deft.promise.Deferred()
        result = {}
        result[Rally.apps.roadmapplanningboard.PlanningBoard.PREFERENCE_NAME] = state
        deferred.resolve result
        deferred.promise

  beforeEach ->
    Rally.test.apps.roadmapplanningboard.helper.TestDependencyHelper.loadDependencies()
    @stubExpandStatePreference()

  afterEach ->
    @cardboard?.destroy()
    Deft.Injector.reset()
    Rally.data.PreferenceManager.load.restore()

  it 'should call the preference manager to get the initial expansion state of the header', ->
    loadStub = @stubExpandStatePreference 'false'
    @createCardboard().then =>
      _.each @getCollapsableHeaderElements(), =>
        expect(loadStub).toHaveBeenCalled()

  it 'should show expanded header when the board is created', ->
    @createCardboard().then =>
      _.each @getCollapsableHeaderElements(), (element) =>
        expect(element.getHeight() > 0).toBe true
        expect(element.query('.field_container').length).toBe 1

  it 'should show a collapsed header when the board is created with the toggle indication a collapsed state', ->
    @stubExpandStatePreference 'false'
    @createCardboard().then =>
      _.each @getCollapsableHeaderElements(), (element) =>
        expect(element.getHeight()).toBe 0

  it 'should collapse header when the theme collapse button is clicked', ->
    @createCardboard(plugins: [ptype: 'rallyfixedheadercardboard']).then =>
      @toggleExpansion().then =>
        _.each @getCollapsableHeaderElements(), (element) =>
          expect(element.getHeight()).toBe 0

  it 'should expand header when the theme expand button is clicked', ->
    @stubExpandStatePreference 'false'
    @createCardboard(plugins: [ptype: 'rallyfixedheadercardboard']).then =>
      @toggleExpansion().then =>
        _.each @getCollapsableHeaderElements(), (element) =>
          expect(element.getHeight() > 0).toBe true
          expect(element.query('.field_container').length).toBe 1

  it 'should return client metrics message when toggle button is clicked and header is expanded', ->
    @createCardboard().then =>
      @toggleExpansion().then =>
        expect(@cardboard._getClickAction()).toEqual("Roadmap header expansion toggled from [true] to [false]")

  it 'should return client metrics message when expand button is clicked and header is collapsed', ->
    @stubExpandStatePreference 'false'
    @createCardboard(plugins: [ptype: 'rallyfixedheadercardboard']).then =>
      @toggleExpansion().then =>
        expect(@cardboard._getClickAction()).toEqual("Roadmap header expansion toggled from [false] to [true]")

  it 'should save a preference when toggle button is clicked', ->
    updateSpy = @spy Rally.data.PreferenceManager, 'update'
    @createCardboard().then =>
      @toggleExpansion().then =>
        expect(updateSpy).toHaveBeenCalled()
