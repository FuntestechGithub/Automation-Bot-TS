const { start } = require('./automationbot-action-adaptive-runtime-express/lib');

(async function() {
    await start(process.cwd(), "settings");
})();
