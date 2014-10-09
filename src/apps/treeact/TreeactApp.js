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
            var context = this.getContext();
            var baseUrl = window.location.protocol + '//' + window.location.hostname + ':3001/';

            var cssFiles = ['bootstrap.min.css'];

            _.each(cssFiles, function (cssFile) {
                $('<link rel="stylesheet" type="text/css" href="' + baseUrl + '/css/' + cssFile + '" />').appendTo($(this.getEl().dom));
            }, this);

            $.getScript(baseUrl + 'bundle.js').then(function () {
                treeact.ui.mount({
                    el: container,
                    project: context.getProject(),
                    workspace: context.getWorkspaceRef()
                });
            });
        }
    });
})();