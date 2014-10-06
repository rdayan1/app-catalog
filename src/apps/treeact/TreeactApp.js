(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.treeact.TreeactApp', {
        extend: 'Rally.app.App',
        cls: 'treeact-app',
        alias: 'widget.treeactapp',
        appName: 'Treeact',

        launch: function() {
            this.add({
                itemId: 'treeact-container',
                xtype: 'component',
                html: '<div class="treeact-container"></div>'
            });

            if (this.rendered) {
                this._init();
            } else {
                this.on('afterrender', this._init, this, { single: true });
            }
        },

        _init: function () {
            var container = this.down('#treeact-container').getEl().dom;

            $.getScript('http://localhost:3000/bundle.js').then(function () {
                treeact.ui.render(container);
            });
        }
    });
})();