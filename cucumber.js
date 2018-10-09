module.exports = {
	"chrome-gui-test": "--tags @desktop --world-parameters " + JSON.stringify({ platform: "chrome-desktop-test", width: 1070, height: 1180 }),
	"chrome-api-test": "--tags @api --world-parameters " + JSON.stringify({ platform: "chrome-desktop-test", width: 1070, height: 1180 })

};
