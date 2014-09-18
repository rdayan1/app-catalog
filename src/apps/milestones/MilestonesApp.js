(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.milestones.MilestonesApp', {
        extend: 'Rally.app.App',
        requires: [
            'Rally.ui.DateField',
            'Rally.ui.combobox.MilestoneProjectComboBox',
            'Rally.ui.gridboard.plugin.GridBoardAddNew',
            'Rally.ui.gridboard.plugin.GridBoardCustomFilterControl',
            'Rally.ui.gridboard.plugin.GridBoardFieldPicker'
        ],
        cls: 'milestones-app',

        launch: function() {
            this._getGridStore().then({
                success: function(gridStore) {
                    this.addGridBoard({
                        gridStore: gridStore
                    });
                },
                scope: this
            });
        },

        addGridBoard: function (config) {
            this.gridboard = Ext.create('Rally.ui.gridboard.GridBoard', this._getGridBoardConfig(config));
            this.add(this.gridboard);
        },

        _getGridStore: function() {
            return Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
                models: ['Milestone'],
                autoLoad: true,
                remoteSort: true,
                root: {expanded: true},
                pageSize: 200,
                enableHierarchy: true,
                childPageSizeEnabled: true,
                fetch: 'FormattedID,Name,TargetDate,Artifacts,TargetProject,TotalArtifactCount'
            });
        },

        _getGridBoardConfig: function (config) {
            return Ext.merge({
                itemId: 'gridboard',
                stateId: 'milestones-gridboard',
                toggleState: 'grid',
                modelNames: ['Milestone'],
                context: this.getContext(),
                addNewPluginConfig: this._addNewConfig(),
                plugins: ['rallygridboardaddnew',
                    {
                        ptype: 'rallygridboardfieldpicker',
                        headerPosition: 'left'
                    },
                    {
                        ptype: 'rallygridboardcustomfiltercontrol',
                        filterChildren: false,
                        filterControlConfig: {
                            blackListFields: [],
                            whiteListFields: [],
                            modelNames: ['milestone'],
                            stateful: true
                        }
                    }
                ],
                gridConfig: this._getGridConfig(config),
                height: 600
            }, config);
        },

        _getGridConfig: function (config) {
            return {
                xtype: 'rallytreegrid',
                columnCfgs: [
                    {
                        dataIndex: 'FormattedID',
                        renderer: function(formattedID) {
                            return Ext.create('Rally.ui.renderer.template.FormattedIDTemplate').apply({
                               _type: 'milestone',
                               FormattedID: formattedID,
                               Recycled: true
                            });
                        }
                    },
                    'Name',
                    'TargetDate',
                    {
                        dataIndex: 'TotalArtifactCount',
                        text: 'Item Count',
                        tdCls: 'artifacts'
                    },
                    {
                        dataIndex: 'TargetProject',
                        renderer: function(project) {
                            if (project === ''){
                                return '<div class="permission-required">Project Permissions Required</div>';
                            }
                            if (project === null) {
                                return 'All projects in ' +  context.getWorkspace().Name;
                            }
                            return project.Name;
                        },
                        text: 'Project'
                    }
                ],
                enableBulkEdit: true,
                enableRanking: false,
                store: config.gridStore,
                showRowActionsColumn: true,
                showIcon: false
            };
        },

        _addNewConfig: function() {
            if (this.context.getPermissions().isProjectEditor(this.context.getProjectRef())) {
                return {
                    recordTypes: ['Milestone'],
                    showAddWithDetails: false,
                    openEditorAfterAddFailure: false,
                    minWidth: 800,
                    additionalFields: [
                        {
                            xtype: 'rallydatefield',
                            emptyText: 'Select Date',
                            name: 'TargetDate'
                        },
                        {
                            xtype: 'rallymilestoneprojectcombobox',
                            minWidth: 250,
                            name: 'TargetProject',
                            value: Rally.util.Ref.getRelativeUri(this.getContext().getProject())
                        }
                    ]
                };
            }
            return {};
        },

        _getEmptyText: function() {
            return '<div class="no-data-container"><div class="primary-message">Looks like milestones have not yet been defined for the current project.</div><div class="secondary-message">Add a milestone with the Add New button above.</div></div>';
        }
    });
})();