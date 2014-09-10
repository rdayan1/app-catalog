(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', {
        extend: 'Rally.apps.treegrid.TreeGridApp',
        requires: [
          'Rally.ui.grid.TreeGrid',
          'Rally.ui.grid.plugin.TreeGridExpandedRowPersistence',
          'Rally.ui.gridboard.GridBoard',
          'Rally.ui.gridboard.plugin.GridBoardPortfolioItemTypeCombobox',
          'Rally.ui.gridboard.plugin.GridBoardCustomFilterControl',
          'Rally.data.util.PortfolioItemTypeDefList'
        ],
        alias: 'widget.portfolioitemstreegridapp',
        componentCls: 'pitreegrid',
        loadGridAfterStateRestore: false, //grid will be loaded once modeltypeschange event is fired from the type picker

        statePrefix: 'portfolioitems',
        piTypeDefArray: undefined,

        config: {
            defaultSettings: {
                columnNames: ['Name', 'PercentDoneByStoryPlanEstimate', 'PercentDoneByStoryCount', 'PreliminaryEstimate', 'PlannedStartDate', 'PlannedEndDate', 'ValueScore', 'RiskScore', 'InvestmentCategory']
            }
        },

        launch: function() {
            if(!this.rendered) {
                this.on('afterrender', this._getPortfolioItemTypeDefArray, this, {single: true});
            } else {
                this._getPortfolioItemTypeDefArray();
            }
        },

        _getPortfolioItemTypeDefArray: function() {
            return Ext.create('Rally.data.util.PortfolioItemTypeDefList')
            .getArray(this.getContext().getDataContext())
            .then({
                success: this._loadAppWithPortfolioItemType,
                scope: this
            });
        },

        _loadAppWithPortfolioItemType: function(piTypeDefArray) {
            this.piTypeDefArray = piTypeDefArray;
            var allPiTypePaths = _.pluck(piTypeDefArray, 'TypePath');
            this._configureFilter(allPiTypePaths);

            this._loadApp(allPiTypePaths);
        },

        _configureFilter: function(allPIModelNames) {
            var filterControlStateId = 'portfolio-tree-custom-filter-button',
                initialModelNames = this._getDefaultModelNames(filterControlStateId, [allPIModelNames[0]]);

            this.filterControlConfig = {
                blacklistFields: ['PortfolioItemType', 'State'],
                stateful: true,
                stateId: this.getContext().getScopedStateId(filterControlStateId),
                whiteListFields: ['Milestones'],
                modelNames: initialModelNames
            };
        },

        _getGridBoardPlugins: function() {
            var plugins = this.callParent();
            plugins.push({
                ptype: 'rallygridboardpitypecombobox',
                context: this.getContext()
            });
            return plugins;
        },

        _getDefaultModelNames: function(settingName, defaultArray) {
            var modelNamesArray, typeNameArray,
                prefValue = this.getSetting(settingName);

            if (prefValue) {
                typeNameArray = Ext.decode(prefValue).types;
                modelNamesArray = this._convertTypesToModelNames(typeNameArray);
            }

            return modelNamesArray || defaultArray;
        },

        _convertTypesToModelNames: function(typeNameArray) {
            if (typeNameArray && typeNameArray.length === 1) {
                var typeModelMap = this._getTypesByNames(_.pluck(this.piTypeDefArray, 'TypePath'));
                return typeModelMap[typeNameArray[0]];
            }
        },

        _getTypesByNames: function(modelNames) {
            var typeName;
            return _.reduce(modelNames, function (typeModelMap, modelName) {
                typeName = Rally.data.ModelTypes.getTypeByName(modelName).toLowerCase();
                typeModelMap[typeName] = modelName;
                return typeModelMap;
            }, {}, this);
        }
    });
})();
