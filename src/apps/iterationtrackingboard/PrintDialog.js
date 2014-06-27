(function(){

    var Ext = window.Ext4 || window.Ext;

    /**
    * shows print dialog for Iteration Progress App
    */
    Ext.define('Rally.apps.iterationtrackingboard.PrintDialog', {
        extend: 'Rally.ui.dialog.Dialog',
        alias:'widget.iterationprogessappprintdialog',
        requires: [
            'Rally.ui.Button'
        ],
        config: {
            autoShow: true,
            draggable: true,
            disableScroll: true,
            width: 520,
            height: 300,
            closable: true,
            title: 'Print'
        },
        layout: {
            type: 'vbox',
            align: 'left'
        },
        cls: 'iteration-progress-dialog print-dialog',
        items: [
            {
                xtype: 'container',
                html: 'What would you like to print?',
                cls: 'dialog-title'
            },
            {
                xtype: 'radiogroup',
                id: 'whattoprint',
                vertical: true,
                columns: 1,
                height: 70,
                items: [
                    {
                        boxLabel: 'Summary list of work items',
                        name: 'reportType',
                        inputValue: 'summary',
                        checked: true
                    },
                    {
                        boxLabel: 'Summary list of work items with children',
                        name: 'reportType',
                        inputValue: 'includechildren'
                    }
                ]
            }
        ],
        constructor: function(config) {
            this.initConfig(config || {});
            this.timeboxScope = this.config.timeboxScope;

            this.nodesToExpand = [];
            this.allRecords = [];

            this.callParent(arguments);
        },

        initComponent: function() {
            var warningTextClasses = this.showWarning ? 'print-warning' : 'print-warning hidden';
            this.items.push({
                xtype: 'container',
                html: '<div class="icon-warning alert"></div></span> Iterations with more than 400 items may cause problems when printing.',
                cls: warningTextClasses,
                itemId: 'tooManyItems'
            });

            this.dockedItems = [{
                xtype: 'toolbar',
                dock: 'bottom',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                ui: 'footer',
                itemId: 'footer',
                defaults: {
                    xtype: 'rallybutton',
                    padding: '4 12',
                    scope: this
                },
                items: [
                    {
                        text: 'Print',
                        cls: 'primary medium',
                        handler: this._handlePrintClick
                    },
                    {
                        text: 'Cancel',
                        cls: 'secondary medium',
                        handler: this._handleCancelClick
                    }
                ]
            }];

            this.callParent(arguments);
        },

        _handlePrintClick: function(target, e) {
            var includeChildren = Ext.getCmp('whattoprint').getChecked()[0].inputValue === 'includechildren';

            var storeConfig = this._buildStoreConfig(includeChildren);
            var treeStoreBuilder = Ext.create('Rally.data.wsapi.TreeStoreBuilder');

            treeStoreBuilder.build(storeConfig);
        },

        _handleCancelClick: function(target, e) {
            this.destroy();
        },

        _buildStoreConfig: function(shouldIncludeChildren) {
            var context = Rally.environment.getContext();
            var timeboxFilter = this.timeboxScope.getQueryFilter();

            // var context = Rally.environment.getContext();

            var storeConfig = {
                models: ['User Story', 'Defect', 'Defect Suite', 'Test Set'],
                autoLoad: true,
                remoteSort: true,
                root: {expanded: shouldIncludeChildren},
                enableHierarchy: shouldIncludeChildren,
                childPageSizeEnabled: false,
                filters: [timeboxFilter],
                listeners: {
                    load: this._onStoreLoad,
                    scope: this
                }
            };

            return storeConfig;
        },

        _onStoreLoad: function(treeStore, node, records, success, eOpts) {
            if (_.isEmpty(this.allRecords)) {
                this.allRecords = _.union(this.allRecords, records);
            }

            if (treeStore.enableHierarchy) {
                this.nodesToExpand = _.without(this.nodesToExpand, node.objectID);

                _(records).filter(function(record) {
                    return !record.isLeaf();
                }).forEach(function(record) {
                    this.nodesToExpand.push(record.objectID);
                    record.expand(true);
                }, this);
            }

            if (_.isEmpty(this.nodesToExpand)) {
                this._onDataReady();
            }
        },

        _onDataReady: function() {
            debugger; // pass this.allRecords to the view
        }
    });
})();
