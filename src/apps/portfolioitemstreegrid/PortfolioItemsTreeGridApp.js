(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', {
        extend: 'Rally.apps.treegrid.TreeGridApp',
        requires: [
          'Rally.ui.grid.TreeGrid',
          'Rally.ui.grid.plugin.TreeGridExpandedRowPersistence',
          'Rally.ui.gridboard.GridBoard',
          'Rally.ui.picker.PillPicker',
          'Rally.ui.picker.MultiObjectPicker',
          'Rally.ui.gridboard.plugin.GridBoardFieldPicker'
        ],
        alias: 'widget.portfolioitemstreegridapp',
        componentCls: 'pitreegrid',

        statePrefix: 'portfolioitems',

        config: {
            defaultSettings: {
                modelNames: ['PortfolioItem/Strategy'],
                columnNames: ['Name', 'PercentDoneByStoryPlanEstimate', 'PercentDoneByStoryCount', 'PreliminaryEstimate', 'PlannedStartDate', 'PlannedEndDate', 'ValueScore', 'RiskScore', 'InvestmentCategory']
            }
        },

        _getGridBoardPlugins: function () {
            var plugins = this.callParent(),
                context = this.getContext();

            var alwaysSelectedValues = ['FormattedID', 'Name', 'Owner'];
            if (context.getWorkspace().WorkspaceConfiguration.DragDropRankingEnabled) {
                alwaysSelectedValues.push('DragAndDropRank');
            }

            plugins.push({
                ptype: 'rallygridboardfieldpicker',
                headerPosition: 'left',
                gridFieldBlackList: [
                    'ObjectID',
                    'Description',
                    'DisplayColor',
                    'Notes',
                    'Subscription',
                    'Workspace',
                    'Changesets',
                    'RevisionHistory',
                    'Children',
                    'Successors',
                    'Predecessors'
                ],
                margin: '3 9 14 0',
                alwaysSelectedValues: alwaysSelectedValues,
                modelNames: this.modelNames
            });

            return plugins;
        },

        _getGridConfig: function (gridStore, context, stateId) {
            var gridConfig = this.callParent(arguments);
            gridConfig.alwaysShowDefaultColumns = false;

            return gridConfig;
        }
    });
})();
