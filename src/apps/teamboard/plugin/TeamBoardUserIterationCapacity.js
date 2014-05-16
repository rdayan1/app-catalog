(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.teamboard.plugin.TeamBoardUserIterationCapacity', {
        alias: 'plugin.rallyteamboarduseriterationcapacity',
        extend: 'Rally.apps.teamboard.plugin.TeamBoardIterationPlugin',
        requires: ['Rally.ui.cardboard.plugin.CardContentRight'],

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
            }
        },

        onIterationComboReady: function(cmp, combo){
            this.callParent(arguments);

            this.cmp.on('aftercarddroppedsave', function(){
                this.showData(this.findIterationRecord(combo.getValue(), combo));
            }, this);
        },

        showData: function(iterationRecord){
            if(iterationRecord) {
                iterationRecord.getCollection('UserIterationCapacities', {
                    autoLoad: true,
                    fetch: 'Capacity,Load,TaskEstimates,User',
                    limit: Infinity,
                    listeners: {
                        load: function (store, records) {
                            this._updateCapacities(records, true);
                        },
                        scope: this
                    }
                });
            }else{
                this._updateCapacities([], false);
            }
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
        }
    });
})();