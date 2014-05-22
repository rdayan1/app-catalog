Ext = window.Ext4 || window.Ext

Ext.require []

describe 'Rally.apps.iterationtrackingboard.statsbanner.CollapseExpand', ->

  helpers
    createPane: (config = {}) ->
      @store = Ext.create 'Ext.data.Store',
        model: Rally.test.mock.data.WsapiModelFactory.getModel 'userstory'
      @pane = Ext.create 'Rally.apps.iterationtrackingboard.statsbanner.CollapseExpand', _.defaults config,
        renderTo: 'testDiv'
        store: @store

  afterEach ->
    Rally.test.destroyComponentsOfQuery 'statsbannercollapseexpand'

  it 'should add collapse-expand class', ->
    @createPane()
    expect(@pane.hasCls('collapse-expand')).toBeTruthy()

  it 'should show collapse icon initially', ->
    @createPane()

    expect(@pane.isExpanded()).toBeTruthy()
    expect(@pane.getEl().down('.icon-chevron-up').isVisible(true)).toBe true
    expect(@pane.getEl().down('.icon-chevron-down').isVisible(true)).toBe false

  it 'should show collapse icon when toggled while collapsed', ->
    @createPane expanded: false
    @pane.toggle()

    expect(@pane.getEl().down('.icon-chevron-up').isVisible(true)).toBe true
    expect(@pane.getEl().down('.icon-chevron-down').isVisible(true)).toBe false

  it 'should show expand icon when toggled while expanded', ->
    @createPane()
    @pane.toggle()

    expect(@pane.getEl().down('.icon-chevron-up').isVisible(true)).toBe false
    expect(@pane.getEl().down('.icon-chevron-down').isVisible(true)).toBe true

  it 'should fire toggle event when toggle icon is clicked', ->
    @createPane()
    @store.add @mom.getRecord 'userstory'
    toggleStub = @stub()
    @pane.on('toggle', toggleStub)
    @click(css: '.collapse-expand').then =>
      @waitForCallback toggleStub
