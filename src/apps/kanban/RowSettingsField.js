(function() {
    var Ext = window.Ext4 || window.Ext;

    /**
     * Allows configuring of rows for the cardboard
     *
     *
     *      @example
     *      Ext.create('Ext.Container', {
         *          items: [{
         *              xtype: 'kanbanrowsettingsfield',
         *              value: {
         *                  show: true,
         *                  field: 'c_ClassofService'
         *              }
         *          }],
         *          renderTo: Ext.getBody().dom
         *      });
     *
     */
    Ext.define('Rally.apps.kanban.RowSettingsField', {
        alias: 'widget.kanbanrowsettingsfield',
        extend: 'Ext.form.FieldContainer',
        requires: [
            'Rally.ui.CheckboxField',
            'Rally.ui.combobox.ComboBox',
            'Rally.ui.plugin.FieldValidationUi'
        ],

        mixins: {
            field: 'Ext.form.field.Field'
        },

        layout: 'hbox',

        cls: 'row-settings',

        config: {
            /**
             * @cfg {Object}
             *
             * The row settings value for this field
             */
            value: undefined
        },

        initComponent: function() {
            this.callParent(arguments);

            this.mixins.field.initField.call(this);

            this.add([
                {
                    xtype: 'rallycheckboxfield',
                    name: 'showRows',
                    boxLabel: '',
                    submitValue: false,
                    value: this.getValue().showRows,
                    listeners: {
                        change: function(checkbox, checked) {
                            this.down('rallycombobox').setDisabled(!checked);
                        },
                        scope: this
                    }
                },
                {
                    xtype: 'rallycombobox',
                    plugins: ['rallyfieldvalidationui'],
                    name: 'rowsField',
                    margin: '0 5px',
                    value: this.getValue().rowsField,
                    displayField: 'name',
                    valueField: 'value',
                    disabled: this.getValue().showRows !== 'true',
                    editable: false,
                    submitValue: false,
                    storeType: 'Ext.data.Store',
                    storeConfig: {
                        remoteFilter: false,
                        fields: ['name', 'value'],
                        data: [
//                            TODO placeholders for S70392 to complete
//                            {'name': 'Artifact Type', 'value': ''},
//                            {'name': 'Blocked', 'value': 'Blocked'},
                            {'name': 'Class Of Service', 'value': 'c_ClassOfService'}
//                            {'name': 'Owner', 'value': 'Owner'},
//                            {'name': 'Sizing', 'value': 'PlanEstimate'}
                        ]
                    }
                }
            ]);
        },

        /**
         * When a form asks for the data this field represents,
         * give it the name of this field and the ref of the selected project (or an empty string).
         * Used when persisting the value of this field.
         * @return {Object}
         */
        getSubmitData: function() {
            var data = {};
            var showRows = this.down('rallycheckboxfield');
            data[showRows.name] = showRows.getValue();
            if (showRows.getValue()) {
                var rowsField = this.down('rallycombobox');
                data[rowsField.name] = rowsField.getValue();
            }
            return data;
        }
    });
})();


