(function() {

    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.roadmapplanningboard.DeftInjector', {
        singleton: true,
        requires: [
            'Rally.data.Store',
            'Rally.data.rpm.ModelFactory',
            'Rally.apps.roadmapplanningboard.util.NextDateRangeGenerator',
            'Rally.data.aggregate.ModelFactory',
        ],
        loaded: false,

        init: function () {
            if (!this.loaded) {
                Deft.Injector.configure({
                    timelineStore: {
                        className: 'Rally.data.Store',
                        parameters: [{
                            model: Rally.data.rpm.ModelFactory.getTimelineModel()
                        }]
                    },
                    timeframeStore: {
                        className: 'Rally.data.Store',
                        parameters: [{
                            model: Rally.data.rpm.ModelFactory.getTimeframeModel()
                        }]
                    },
                    planStore: {
                        className: 'Rally.data.Store',
                        parameters: [{
                            model: Rally.data.rpm.ModelFactory.getPlanModel()
                        }]
                    },
                    roadmapStore: {
                        className: 'Rally.data.Store',
                        parameters: [{
                            model: Rally.data.rpm.ModelFactory.getRoadmapModel()
                        }]
                    },
                    preliminaryEstimateStore: {
                      className: 'Rally.data.wsapi.Store',
                      parameters: [{
                            model: 'PreliminaryEstimate'
                      }]
                    },
                    nextDateRangeGenerator: {
                        className: 'Rally.apps.roadmapplanningboard.util.NextDateRangeGenerator'
                    }
                });
            }
            this.loaded = true;
        }
    });
})();
