(function() {
    var Ext = window.Ext4 || window.Ext;

    /**
     * Abstract class to handle expanding / collapsing for banner widgets
     */
    Ext.define('Rally.apps.iterationtrackingboard.statsbanner.BannerWidget', {
        extend: 'Ext.Component',
        alias:'widget.almbannerwidget',

        config: {
            expanded: true
        },

        tpl: [
            '<div class="expanded-widget"></div>',
            '<div class="collapsed-widget"></div>'
        ],

        initComponent: function() {
            this.data = _.merge({expanded: this.expanded}, this.data);
            this.callParent(arguments);
        },

        afterRender: function() {
            this.callParent(arguments);
            this._setExpandedStyle();
        },

        isExpanded: function() {
            return this.expanded;
        },

        update: function() {
            this.callParent(arguments);

            if (this.expanded) {
                this._setExpandedStyle();
            } else {
                this._setCollapsedStyle();
            }
        },

        toggle: function() {
            if (this.expanded) {
                this.collapse();
            } else {
                this.expand();
            }
        },

        expand: function() {
            this.expanded = true;
            this._setExpandedStyle();
        },

        collapse: function() {
            this.expanded = false;
            this._setCollapsedStyle();
        },

        _setCollapsedStyle: function() {
            this.getEl().down('.expanded-widget').addCls(Ext.baseCSSPrefix + 'hide-display');
            this.getEl().down('.collapsed-widget').removeCls(Ext.baseCSSPrefix + 'hide-display');
        },

        _setExpandedStyle: function() {
            this.getEl().down('.expanded-widget').removeCls(Ext.baseCSSPrefix + 'hide-display');
            this.getEl().down('.collapsed-widget').addCls(Ext.baseCSSPrefix + 'hide-display');
        },

        _getRenderData: function(data) {
            return _.merge({}, {expanded: this.expanded}, data);
        }
    });
})();