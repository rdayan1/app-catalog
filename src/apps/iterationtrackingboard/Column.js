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

        updateExistingRecord: function(record) {
            if (this.findCardInfo(record)) {
                this.refreshCard(record);
            }
        },

        insertRecordIfShould: function(record) {
            if (!this.findCardInfo(record) && this.isMatchingRecord(record)) {
                this.createAndAddCard(record);
            }
        },

        isMatchingRecord: function(record) {
            if (_.isFunction(record.get)) {
                return this.callParent(arguments);
            }
            return false;
        },

        /**
         * This is only called for realtime messages, and Cardboard does not yet support realtime associated record updates.
         * See ObjectUpdateListener.
         */
        updateAssociatedRecords: Ext.emptyFn,
    });
})();
