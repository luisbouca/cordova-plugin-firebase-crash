const path = require("path");
const xcode = require("./xcode")

module.exports = {
    BUILD_PHASE_COMMENT: "Crashlytics",

    getXcodeProjectPath: function(context) {
        //const ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
        const ConfigParser = xcode.configparser;
        const appName = new ConfigParser("config.xml").name();
        return path.join("platforms", "ios", appName + ".xcodeproj", "project.pbxproj");
    }
};
