Ext = window.Ext4 || window.Ext

Ext.require [
  'Rally.app.TimeboxScope',
  'Rally.data.wsapi.artifact.Store'
]

describe 'Rally.apps.iterationtrackingboard.StatsBanner', ->

  helpers
    createBanner: (config={})->
      timeboxScope = config.scope || Ext.create 'Rally.app.TimeboxScope', record: @mom.getRecord 'iteration'
      @banner = Ext.create 'Rally.apps.iterationtrackingboard.StatsBanner',
        renderTo: 'testDiv'
        context:
          getTimeboxScope: -> timeboxScope
          getDataContext: -> Rally.environment.getContext().getDataContext()
        items: [{xtype: 'component'}]

  beforeEach ->
    us = @mom.getData 'userstory'
    @ajax.whenQuerying('artifact').respondWith us

  afterEach ->
    Rally.test.destroyComponentsOfQuery 'statsbanner'

  describe 'initComponent', ->

    describe 'item defaults', ->
      it 'should apply store to intance items not class items', ->
        @createBanner()

        expect(_.has(@banner.items.get(0), 'store')).toBe true
        expect(_.has(@banner.self.prototype.items[0], 'store')).toBe false

    describe 'Rally.Message handlers', ->
      it 'should update in response to Rally.Message.object* messages', ->
        @createBanner()
        loadSpy = @spy @banner.store, 'load'
        for message in ['objectCreate', 'objectUpdate', 'bulkUpdate', 'objectDestroy']
          Rally.environment.getMessageBus().publish Rally.Message[message], @mom.getData 'userstory'
          expect(loadSpy.callCount).toEqual 1
          loadSpy.reset()

      it 'should not update when unscheduled', ->
        @createBanner scope: Ext.create 'Rally.app.TimeboxScope', type: 'iteration'
        loadSpy = @spy @banner.store, 'load'
        Rally.environment.getMessageBus().publish Rally.Message.objectCreate, @mom.getData 'userstory'
        expect(loadSpy.callCount).toBe 0

    describe 'Window Resize', ->
      it 'should register handler for window resize', ->
        onWindowResizeSpy = @spy Ext.EventManager, 'onWindowResize'
        @createBanner()
        expect(onWindowResizeSpy).toHaveBeenCalledWith @banner.doLayout, @banner

      it 'should unregister handler when banner is destroyed', ->
        @createBanner()
        removeResizeListenerSpy = @spy Ext.EventManager, 'removeResizeListener'
        @banner.destroy()
        expect(removeResizeListenerSpy).toHaveBeenCalledWith @banner.doLayout, @banner

    describe 'Artifact Store', ->
      it 'should get correct models', ->
        @createBanner()
        expect(@banner.store.models).toEqual ['User Story', 'Defect', 'Defect Suite', 'Test Set']

      it 'should fetch fields correctly', ->
        @createBanner()
        expect(@banner.store.fetch).toEqual ['Defects:summary[State;ScheduleState+Blocked]', 
            'PlanEstimate', 'Requirement', 'FormattedID', 'Name', 'Blocked', 'BlockedReason','ScheduleState', 'State', 'Tasks:summary[State+Blocked]', 'TestCases']

      it 'should filter correctly', ->
        @createBanner()
        filters = @banner.store.filters.getRange()
        expect(filters.length).toBe 1
        expect(filters[0].toString()).toBe @banner.context.getTimeboxScope().getQueryFilter().toString()

      it 'should set context correctly', ->
        @createBanner()
        expect(@banner.store.context).toEqual @banner.context.getDataContext()

      it 'should set limit correctly', ->
        @createBanner()
        expect(@banner.store.limit).toEqual Infinity

      it 'should load store if there is a timebox', ->
        loadSpy = @spy Rally.data.wsapi.artifact.Store::, 'load'
        @createBanner()
        expect(loadSpy).toHaveBeenCalled()

      it 'should not load from store if there is no timebox', ->
        loadSpy = @spy Rally.data.wsapi.artifact.Store::, 'load'
        @createBanner scope: Ext.create 'Rally.app.TimeboxScope', type: 'iteration'
        expect(loadSpy).not.toHaveBeenCalled()