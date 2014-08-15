(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.board.BoardApp', {
        extend: 'Rally.app.App',
        alias: 'widget.boardapp',
        requires: [
            'Rally.apps.board.Settings',
            'Rally.ui.cardboard.CardBoard'
        ],

        config: {
            defaultSettings: {
                type: 'HierarchicalRequirement',
                groupByField: 'ScheduleState',
                fields: 'FormattedID,Name,Owner',
                query: '',
                order: 'Rank'
            }
        },

        launch: function() {
            this.add({
                xtype: 'rallycardboard',
                margin: '10px 0 0 0',
                types: [this.getSetting('type')],
                attribute: this.getSetting('groupByField'),
                context: this.getContext(),
                rowConfig: {
                    field: this.getSetting('rowsField'),
                    sortDirection: 'ASC'
                },
                storeConfig: {
                    filters: this._getQueryFilters(),
                    sorters: [
                        {
                            property: 'WorkProduct',
                            direction: 'ASC'
                        },
                        {
                            property: 'TaskIndex',
                            direction: 'ASC'
                        }
                    ]
                },
                cardConfig: {
                    editable: true,
                    showIconMenus: true,
                    fields: this.getSetting('fields').split(',')
                },
                loadMask: true
            });
        },

        getSettingsFields: function() {
            return Rally.apps.board.Settings.getFields(this.getContext());
        },

        onTimeboxScopeChange: function() {
            this.callParent(arguments);
            this.down('rallycardboard').refresh({
                storeConfig: {
                    filters: this._getQueryFilters()
                }
            });
        },

        _getQueryFilters: function() {
            var queries = [];
            if (this.getSetting('query')) {
                queries.push(Rally.data.QueryFilter.fromQueryString(this.getSetting('query')));
            }
            if (this.getContext().getTimeboxScope()) {
                queries.push(this.getContext().getTimeboxScope().getQueryFilter());
            }

            return queries;
        }
    });
})();
