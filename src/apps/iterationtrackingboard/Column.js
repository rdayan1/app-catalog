(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.iterationtrackingboard.Column', {
        extend: 'Rally.ui.cardboard.Column',
        alias: 'widget.iterationtrackingboardcolumn',

        getStoreFilter: function(model) {
            var filters = [];
            Ext.Array.push(filters, this.callParent(arguments));
            if (model.elementName === 'HierarchicalRequirement' && this.context.getSubscription().StoryHierarchyEnabled) {
                filters.push({
                    property: 'DirectChildrenCount',
                    value: 0
                });
            }

            return filters;
        },

        /**
         * These are only called for realtime creates, and Cardboard does not yet support realtime creates or associated record updates.
         * See ObjectUpdateListener.
         */
        insertRecordIfShould: Ext.emptyFn,
        updateAssociatedRecords: Ext.emptyFn,

        updateExistingRecord: function(record) {
            if (this.findCardInfo(record)) {
                this.refreshCard(record);
            }
        }
    });
})();
