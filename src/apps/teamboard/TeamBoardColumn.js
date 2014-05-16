(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.teamboard.TeamBoardColumn', {
        extend: 'Rally.ui.cardboard.Column',
        alias: 'widget.rallyteamcolumn',
        requires: [
            'Rally.apps.teamboard.TeamBoardDropController',
            'Rally.apps.teamboard.TeamBoardIterationScoper',
            'Rally.ui.cardboard.plugin.ColumnCardCounter'
        ],

        plugins: [
            {ptype: 'rallycolumncardcounter'},
            {ptype: 'rallyteamboarditerationscoper'}
        ],

        config: {
            dropControllerConfig: {
                ptype: 'rallyteamboarddropcontroller'
            }
        },

        assign: function(record){
            // Don't need to do anything to the User record
        },

        getStoreFilter: function(model) {
            return {
                property: this.attribute,
                operator: 'contains',
                value: this.getValue()
            };
        },

        isMatchingRecord: function(record){
            return true;
        }
    });

})();