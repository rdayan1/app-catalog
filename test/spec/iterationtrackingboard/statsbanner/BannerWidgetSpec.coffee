Ext = window.Ext4 || window.Ext

describe 'Rally.apps.iterationtrackingboard.statsbanner.BannerWidget', ->

  helpers
    createPane: (config={}) ->
      @pane = Ext.create 'Rally.apps.iterationtrackingboard.statsbanner.BannerWidget', _.defaults config,
        renderTo: 'testDiv'

  afterEach ->
    Rally.test.destroyComponentsOfQuery 'almbannerwidget'

  describe 'expand / collapse', ->

    it 'initializes expanded to true', ->
      @createPane()
      expect(@pane.isExpanded()).toBe true

    it 'sets expanded to true when passed in', ->
      @createPane expanded: true
      expect(@pane.isExpanded()).toBe true

    it 'sets expanded to false when passed in', ->
      @createPane expanded: false
      expect(@pane.isExpanded()).toBe false

    it 'collapses when toggled in expanded mode', ->
      @createPane()
      @spy @pane, 'collapse'
      @pane.toggle()
      expect(@pane.collapse.callCount).toBe 1
      expect(@pane.isExpanded()).toBe false
      expect(@pane.getEl().down('.expanded-widget').getStyle('display')).toBe 'none'
      expect(@pane.getEl().down('.collapsed-widget').getStyle('display')).toBe 'block'

    it 'expands when toggled in collapsed mode', ->
      @createPane expanded: false
      @spy @pane, 'expand'
      @pane.toggle()
      expect(@pane.expand.callCount).toBe 1
      expect(@pane.isExpanded()).toBe true
      expect(@pane.getEl().down('.expanded-widget').getStyle('display')).toBe 'block'
      expect(@pane.getEl().down('.collapsed-widget').getStyle('display')).toBe 'none'

