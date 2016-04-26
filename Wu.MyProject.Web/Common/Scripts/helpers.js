var App = App || {};
(function () {

    var appLocalizationSource = abp.localization.getSource('MyProject');
    App.localize = function () {
        return appLocalizationSource.apply(this, arguments);
    };

})(App);