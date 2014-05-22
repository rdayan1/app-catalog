(function() {
    var Ext = window.Ext4 || window.Ext;

    /**
     * shows collapse/expand toggle for stats banner
     */
    Ext.define('Rally.apps.iterationtrackingboard.statsbanner.CollapseExpand', {
        extend: 'Rally.apps.iterationtrackingboard.statsbanner.BannerWidget',
        alias:'widget.statsbannercollapseexpand',
        requires: [],

        tpl: [
            '<div class="expanded-widget">',
                '<div class="toggle-icon icon-chevron-up"></div>',
            '</div>',
            '<div class="collapsed-widget">',
                '<div class="toggle-icon icon-chevron-down"></div>',
            '</div>'
        ],

        componentCls: 'collapse-expand',

        initComponent: function () {
            this.addEvents(
                /**
                 * @event
                 * Fires when collapse or expand toggle is clicked
                 */
                'toggle'
            );

            this.callParent(arguments);
        },

        afterRender: function() {
            this.callParent(arguments);
            this.getEl().on('click', this._onCollapseExpandClick, this);
            this.fireEvent('ready', this);
        },

        _onCollapseExpandClick: function() {
            this.fireEvent('toggle', this);
        },

        toggle: function() {
            this.callParent(arguments);
            this.doComponentLayout();
        }
    });
})();