(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.teamboard.TeamBoardIterationScoper', {
        alias: 'plugin.rallyteamboarditerationscoper',
        extend: 'Ext.AbstractPlugin',
        requires: ['Rally.ui.cardboard.plugin.CardContentRight', 'Rally.ui.combobox.IterationComboBox'],

        init: function(cmp) {
            this.callParent(arguments);

            this.cmp = cmp;
            this.cmp.on('storeload', this._onStoreLoad, this);

            this.progressBarTpl = Ext.create('Rally.ui.renderer.template.progressbar.ProgressBarTemplate', {
                calculateColorFn: function(recordData) {
                    return recordData.Load > 1 ? '#ec0000' : '#76c10f';
                },
                height: '14px',
                percentDoneName: 'Load',
                width: '60px'
            });
        },

        _onStoreLoad: function() {
            this.cmp.getColumnHeader().add({
                xtype: 'rallyiterationcombobox',
                allowNoEntry: true,
                listeners: {
                    change: this._onChange,
                    scope: this
                },
                storeConfig: {
                    context: {
                        project: this.cmp.getValue()
                    }
                }
            });
        },

        _onChange: function(combo, newValue){
            if(newValue){
                combo.getStore().findRecord('_ref', newValue).getCollection('UserIterationCapacities', {
                    autoLoad: true,
                    fetch: 'Capacity,Load,TaskEstimates,User',
                    limit: Infinity,
                    listeners: {
                        load: function(store, records){
                            this._updateCapacities(records);
                        },
                        scope: this
                    }
                });
            }else{
                this._updateCapacities([]);
            }
        },

        _updateCapacities: function(userIterationCapacityRecords) {
            _.each(this.cmp.getCards(), function(card){
                var topRightEl = card.getEl().down('.' + Rally.ui.cardboard.plugin.CardContentRight.TOP_SIDE_CLS);

                var userIterationCapacityRecord = this._findUserIterationCapacityFor(card.getRecord(), userIterationCapacityRecords);
                if(userIterationCapacityRecord){
                    topRightEl.update(this.progressBarTpl.apply(userIterationCapacityRecord.data));
                }else{
                    topRightEl.update('');
                }
            }, this);
        },

        _findUserIterationCapacityFor: function(userRecord, userIterationCapacityRecords) {
            return _.find(userIterationCapacityRecords, function(record){
                return record.get('User')._ref === userRecord.get('_ref');
            });
        }
    });
})();