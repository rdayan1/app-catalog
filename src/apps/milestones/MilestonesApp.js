(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.milestones.MilestonesApp', {
        extend: 'Rally.apps.common.GridBoardApp',
        requires: [
            'Rally.ui.DateField',
            'Rally.ui.combobox.MilestoneProjectComboBox',
            'Rally.ui.grid.MilestoneProjectEditor'
        ],
        cls: 'milestones-app',
        config: {
            enableOwnerFilter: false,
            modelNames: ['Milestone'],
            defaultSettings: {
                columnNames: ['FormattedID','DisplayColor','Name','TargetDate','TotalArtifactCount','TargetProject']
            }
        },

        getStateId: function () {
            return 'milestone';
        },

        getGridConfig: function () {
            return _.merge(this.callParent(arguments), {
                enableRanking: false,
                noDataItemName: 'milestone',
                rowActionColumnConfig: {
                    rowActionsFn: function (record) {
                        return Rally.ui.grid.MilestoneProjectEditor.shouldDisableEditing(record.get('TargetProject')) ? [] : [
                            {
                                xtype: 'rallyrecordmenuitemdelete',
                                record: record
                            }
                        ];
                    }
                }
            });
        },

        getAdditionalFetchFields: function () {
            return ['DisplayColor'];
        },

        getGridStoreConfig: function () {
            return {
                enableHierarchy: false,
                childPageSizeEnabled: false
            };
        },

        getFieldPickerConfig: function () {
            var config = this.callParent(arguments);
            config.gridFieldBlackList = _.union(config.gridFieldBlackList, [
                'Artifacts',
                'CreationDate',
                'Projects',
                'VersionId'
            ]);
            return _.merge(config, {
                gridAlwaysSelectedValues: ['FormattedID', 'Name', 'TargetDate', 'TotalArtifactCount', 'TargetProject']
            });
        },

        getAddNewConfig: function () {
            return {
                showRank: false,
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
    });
})();