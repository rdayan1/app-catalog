(function () {
    var Ext = window.Ext4 || window.Ext;
    var appAutoScroll = Ext.isIE7 || Ext.isIE8;
    var gridAutoScroll = !appAutoScroll;

    Ext.define('Rally.apps.grid.GridApp', {
        extend: 'Rally.app.App',
        layout: 'fit',

        requires: [
            'Rally.data.util.Sorter',
            'Rally.data.wsapi.Filter',
            'Rally.ui.grid.plugin.PercentDonePopoverPlugin',
            'Rally.data.wsapi.TreeStoreBuilder',
            'Rally.ui.grid.TreeGrid'
        ],

        config: {
            defaultSettings: {
                types: 'hierarchicalrequirement'
            }
        },

        autoScroll: appAutoScroll,

        launch: function () {
            this._getGridStore().then({
                success: function (gridStore) {
                    this._addGrid(gridStore);
                },
                scope: this
            });
        },

        _getGridStore: function () {
            var pageSize = this.getSetting('pageSize'),
                fetch = this.getSetting('fetch'),
                types = this.getSetting('types');

            var config = {
                models: types,
                autoLoad: false,
                remoteSort: true,
                root: {expanded: true},
                enableHierarchy: true,
                pageSize: pageSize,
                fetch: fetch
            };

            return Ext.create('Rally.data.wsapi.TreeStoreBuilder').build(config);
        },

        _addGrid: function (gridStore) {
            var context = this.getContext(),
//                fetch = this.getSetting('fetch'),
//                columns = this._getColumns(fetch),
                stateString = 'custom-tree-grid',
                stateId = context.getScopedStateId(stateString),
                plugins = [];

//            if (context.isFeatureEnabled('EXPAND_ALL_TREE_GRID_CHILDREN')) {
//                gridConfig.plugins.push('rallytreegridexpandedrowpersistence');
//            }

            this.add({
                xtype: 'rallytreegrid',
                store: gridStore,
                enableRanking: this.getContext().getWorkspace().WorkspaceConfiguration.DragDropRankingEnabled,
//                defaultColumnCfgs: columns,
                defaultColumnCfgs: this.getSetting('fetch').split(','),
//                enableBulkEdit: context.isFeatureEnabled('BETA_TRACKING_EXPERIENCE'),
                plugins: plugins,
                stateId: stateId,
                autoScroll: gridAutoScroll,
                stateful: true,
//                pageResetMessages: [Rally.app.Message.timeboxScopeChange]
                listeners: {
                    //hacktastic -> have to wait to load store so tree grid has time to load state, need a better way, component should fire events and controller (i.e. this app) should maintain state!
                    afterrender: {
                        fn: function() {
                            gridStore.load();
                        },
                        single: true
                    }
                }
            });
        },

        onTimeboxScopeChange: function (newTimeboxScope) {
            this.callParent(arguments);

            this.down('rallygrid').filter(this._getFilters(), true, true);
        },

        _getFilters: function () {
            var filters = [],
                query = this.getSetting('query'),
                timeboxScope = this.getContext().getTimeboxScope();
            if (query) {
                try {
                    query = new Ext.Template(query).apply({
                        user: Rally.util.Ref.getRelativeUri(this.getContext().getUser())
                    });
                } catch (e) {
                }
                var filterObj = Rally.data.wsapi.Filter.fromQueryString(query);
                filterObj.itemId = filterObj.toString();
                filters.push(filterObj);
            }

            if (timeboxScope && _.every(this.getSetting('types').split(','), this._isSchedulableType, this)) {
                var timeboxFilterObj = timeboxScope.getQueryFilter();
                timeboxFilterObj.itemId = timeboxFilterObj.toString();
                filters.push(timeboxFilterObj);
            }
            return filters;
        },

        _isSchedulableType: function (type) {
            return _.contains(['hierarchicalrequirement', 'task', 'defect', 'defectsuite', 'testset'], type.toLowerCase());
        },

        _getFetchOnlyFields: function () {
            return ['LatestDiscussionAgeInMinutes'];
        },

        _getColumns: function(fetch) {
            if (fetch) {
                return Ext.Array.difference(fetch.split(','), this._getFetchOnlyFields());
            }
            return [];
        },

        _getPlugins: function (columns) {
            var plugins = [];

            if (Ext.Array.intersect(columns, ['PercentDoneByStoryPlanEstimate', 'PercentDoneByStoryCount']).length > 0) {
                plugins.push('rallypercentdonepopoverplugin');
            }

            return plugins;
        }
    });
})();
