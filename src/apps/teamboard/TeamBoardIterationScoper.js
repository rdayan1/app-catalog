(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.teamboard.TeamBoardIterationScoper', {
        alias: 'plugin.rallyteamboarditerationscoper',
        extend: 'Ext.AbstractPlugin',
        requires: [
            'Rally.ui.cardboard.plugin.CardContentRight',
            'Rally.ui.combobox.IterationComboBox',
            'Rally.util.DateTime'
        ],

        inheritableStatics: {
            _getProgressBarTpl: function() {
                this.progressBarTpl = this.progressBarTpl || Ext.create('Rally.ui.renderer.template.progressbar.ProgressBarTemplate', {
                    calculateColorFn: function(recordData) {
                        return recordData.Load > 1 ? '#ec0000' : '#76c10f';
                    },
                    height: '14px',
                    percentDoneName: 'Load',
                    width: '60px'
                });
                return this.progressBarTpl;
            },

            _inProgressDuring: function(iterationRecord) {
                return Rally.data.wsapi.Filter.and([
                    {property: 'ActualStartDate', operator: '<=', value: Rally.util.DateTime.toIsoString(iterationRecord.get('EndDate'))},
                    Rally.data.wsapi.Filter.or([
                        {property: 'ActualEndDate', operator: '>=', value: Rally.util.DateTime.toIsoString(iterationRecord.get('StartDate'))},
                        {property: 'ActualEndDate', value: 'null'}
                    ])
                ]);
            },

            _inProgressNow: function() {
                return Rally.data.wsapi.Filter.and([
                    {property: 'ActualStartDate', operator: '!=', value: 'null'},
                    {property: 'ActualEndDate', value: 'null'}
                ]);
            }
        },

        init: function(cmp) {
            this.callParent(arguments);

            this.cmp = cmp;
            this.cmp.on('storeload', this._onStoreLoad, this);
        },

        _onStoreLoad: function() {
            this.cmp.getColumnHeader().add({
                xtype: 'rallyiterationcombobox',
                allowNoEntry: true,
                listeners: {
                    ready: this._onIterationComboReady,
                    scope: this
                },
                storeConfig: {
                    context: {
                        project: this.cmp.getValue()
                    }
                }
            }, {
                xtype: 'container',
                cls: 'wip-container',
                itemId: 'wipContainer'
            });
        },

        _onIterationComboReady: function(combo) {
            this._onChange(combo, combo.getValue());
            combo.on('change', this._onChange, this);
        },

        _onChange: function(combo, newValue){
            if(newValue){
                var iterationRecord = combo.getStore().findRecord('_ref', newValue);
                this._loadWip(iterationRecord);
                this._loadCapacities(iterationRecord);
            }else{
                this._loadWip();
                this._updateCapacities([], false);
            }
        },

        _loadCapacities: function(iterationRecord){
            iterationRecord.getCollection('UserIterationCapacities', {
                autoLoad: true,
                fetch: 'Capacity,Load,TaskEstimates,User',
                limit: Infinity,
                listeners: {
                    load: function(store, records){
                        this._updateCapacities(records, true);
                    },
                    scope: this
                }
            });
        },

        _updateCapacities: function(userIterationCapacityRecords, showSwipe) {
            _.each(this.cmp.getCards(), function(card){
                var topEl = card.getEl().down('.' + Rally.ui.cardboard.plugin.CardContentRight.TOP_SIDE_CLS);
                var bottomEl = card.getEl().down('.' + Rally.ui.cardboard.plugin.CardContentRight.BOTTOM_SIDE_CLS);

                var uicRecord = this._findUserIterationCapacityFor(card.getRecord(), userIterationCapacityRecords);
                if(uicRecord){
                    topEl.update(this.self._getProgressBarTpl().apply(uicRecord.data));
                    bottomEl.update(this._getHasCapacityHtml(uicRecord));
                }else{
                    topEl.update('');
                    bottomEl.update(showSwipe ? this._getAddCapacityHtml() : '');
                }

                if(showSwipe){
                    card.getEl().addCls('rui-card-swipe');
                }else{
                    card.getEl().removeCls('rui-card-swipe');
                }
            }, this);
        },

        _findUserIterationCapacityFor: function(userRecord, userIterationCapacityRecords) {
            return _.find(userIterationCapacityRecords, function(record){
                return record.get('User')._ref === userRecord.get('_ref');
            });
        },

        _getHasCapacityHtml: function(record) {
            return Ext.create('Rally.ui.renderer.template.CardPlanEstimateTemplate', record.get('Capacity'), 'Capacity').apply();
        },

        _getAddCapacityHtml: function() {
            return Ext.create('Rally.ui.renderer.template.CardPlanEstimateTemplate', '+', 'Capacity', 'no-estimate').apply();
        },

        _getWipContainer: function() {
            return this.cmp.getColumnHeader().down('#wipContainer');
        },

        _loadWip: function(iterationRecord){
            if(!Rally.environment.getContext().getSubscription().isModuleEnabled('Rally Portfolio Manager')) {
                return;
            }

            this._getWipContainer().removeAll();

            var store = Ext.create('Rally.data.wsapi.Store', {
                context: {
                    project: this.cmp.getValue(),
                    projectScopeDown: false,
                    projectScopeUp: false
                },
                fetch: 'FormattedID,Name',
                filters: Rally.data.wsapi.Filter.and([
                    {property: 'Project', value: this.cmp.getValue()},
                    {property: 'Ordinal', value: 0},
                    iterationRecord ? this.self._inProgressDuring(iterationRecord) : this.self._inProgressNow()
                ]),
                model: Ext.identityFn('PortfolioItem')
            });
            store.load({
                callback: this._onWipLoaded,
                scope: this
            });
        },

        _onWipLoaded: function(wipRecords) {
            if(wipRecords.length){
                this._getWipContainer().add(
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
            }
        }
    });
})();