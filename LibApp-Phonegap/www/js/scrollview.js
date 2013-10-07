/*----- Activate scrollview on test page  -----*/

YUI().use('scrollview', function(Y) {

    var scrollView = new Y.ScrollView({
        id: "scrollview",
        srcNode: '#scrollview-content',
        height: 100,
        flick: {
            minDistance:10,
            minVelocity:0.3,
            axis: "y"
        }
    });

    scrollView.render();
});