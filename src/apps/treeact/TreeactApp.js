(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.treeact.TreeactApp', {
        extend: 'Rally.app.App',
        cls: 'treeact-app',
        alias: 'widget.treeactapp',
        appName: 'Treeact',

        launch: function() {
            this.add({
                html: 'HELLO, THIS IS TREEACT.'
            });
        }
    });
})();