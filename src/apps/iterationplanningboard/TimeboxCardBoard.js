(function() {

    var Ext = window.Ext4 || window.Ext;

    /**
     * The cardboard component is used to create a graphical interface for moving Rally objects through different states.
     *
     * Here is a simple example that shows stories by schedule state:
     *
     *      @example
     *      Ext.create('Ext.Viewport', {
     *          items: [{
     *              xtype: 'rallycardboard',
     *              types: ['User Story'],
     *              attribute: 'ScheduleState'
     *          }]
     *       });
     */

    Ext.define('Rally.apps.iterationplanningboard.TimeboxCardBoard', {
        extend: 'Rally.ui.cardboard.CardBoard',
        alias: 'widget.rallytimeboxcardboard',

        initComponent: function() {
            this.callParent(arguments);
            this.on({
                load: this._normalizeColumnStatusFieldStyles,
                scroll: this._normalizeColumnStatusFieldStyles,
                scope: this
            });
        },

        showColumn: function(column) {
            this.callParent(arguments);
            column.getStatusCell().removeCls(this.self.COLUMN_HIDDEN_CLS);
        },

        hideColumn: function(column) {
            this.callParent(arguments);
            column.getStatusCell().addCls(this.self.COLUMN_HIDDEN_CLS);
        },

        destroyColumn: function(column) {
            this.callParent(arguments);
            Ext.removeNode(column.getStatusCell().dom);
        },

       createColumnElements: function(afterOrBefore, column) {
            var insertFnName = afterOrBefore === 'after' ? 'insertAfter' : 'insertBefore';

            var els = this.callParent(arguments);

            var statusCell = Ext.DomHelper.createDom(this._getColumnDomHelperConfig({
                tag: 'th',
                cls: 'card-column-status'
            }));
            Ext.fly(statusCell)[insertFnName](column.getStatusCell());

            els.statusCell = statusCell;
            return els;
        },

        _generateHeaderHtml: function() {
            return this.callParent(arguments) + this._generateTableRowHtml({
                tag: 'th',
                cls: 'card-column-status'
            });
        },

        _addColumnsToDom: function() {
            var statusCellQuery  = this.getEl().query('.column-headers th.card-column-status'),
                headerCellQuery  = this.getEl().query('.column-headers th.card-column');
            _.forEach(this.columnDefinitions, function(colDef, idx) {
                this.renderColumn(colDef, {
                    headerCell:  headerCellQuery[idx],
                    statusCell:  statusCellQuery[idx]
                });
            }, this);
        },

        _normalizeColumnStatusFieldStyles: function() {
            var atLeastOneColumnHasProgressBar = _.some(this.scrollableColumnRecords, function(iteration) {
                iteration = iteration[0];
                var plannedVelocity = iteration.get('PlannedVelocity');
                return Ext.isNumber(plannedVelocity) && plannedVelocity > 0;
            });

            if (atLeastOneColumnHasProgressBar) {
                this.getEl().select('.card-column-status > div').each(function(el) {
                    if (!el.down('.progress-bar')) {
                        el.addCls('empty-status');
                    }
                });
            }
        }
    });
})();

