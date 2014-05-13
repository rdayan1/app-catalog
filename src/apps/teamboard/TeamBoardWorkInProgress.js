(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.teamboard.TeamBoardWorkInProgress', {
        alias: 'plugin.rallyteamboardworkinprogress',
        extend: 'Ext.AbstractPlugin',
        requires: ['Rally.data.wsapi.Filter', 'Rally.util.DetailLink'],

        init: function(cmp) {
            this.callParent(arguments);

            this.cmp = cmp;
            this.cmp.on('afterrender', this._onAfterRender, this);
        },

        _onAfterRender: function() {
            if(Rally.environment.getContext().getSubscription().isModuleEnabled('Rally Portfolio Manager')){
                this.cmp.getColumnHeader().add({
                    xtype: 'container',
                    cls: 'wip-container',
                    hidden: true,
                    itemId: 'wipContainer'
                });

                this._loadWip();
            }
        },

        _loadWip: function() {
            var projectRef = this.cmp.getValue();
            var store = Ext.create('Rally.data.wsapi.Store', {
                context: {
                    project: projectRef,
                    projectScopeDown: false,
                    projectScopeUp: false
                },
                fetch: 'FormattedID,Name',
                filters: Rally.data.wsapi.Filter.and([
                    {property: 'Project', value: projectRef},
                    {property: 'Ordinal', value: 0},
                    {property: 'ActualStartDate', operator: '!=', value: 'null'},
                    {property: 'ActualEndDate', value: 'null'}
                ]),
                model: Ext.identityFn('PortfolioItem')
            });
            store.load({
                callback: this._onWipLoaded,
                scope: this
            });
        },

        _onWipLoaded: function(wipRecords) {
            var wipContainer = this.cmp.getColumnHeader().down('#wipContainer');
            wipContainer.add(
                _.map(wipRecords, function(record){
                    return {
                        xtype: 'component',
                        cls: 'ellipses wip-item',
                        html: Rally.util.DetailLink.getLink({
                            record: record,
                            text: record.get('FormattedID')
                        }) + ': ' + record.get('Name')
                    };
                })
            );
            wipContainer.show();
        }
    });
})();