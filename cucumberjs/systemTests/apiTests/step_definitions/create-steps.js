const World = require("../support/world").World;



module.exports = function () {

    this.World = World;

    this.defineStep(/^I retrieve records from CRM$/, { timeout: 2000000 }, async function () {

        const stDt = Date.now();
        const edDt = Date.now()+1;
        let i = 0;
        for (i= 0;i<= 24;i++)
        {
            const token = await this.activeDirectoryAuthService.getToken();
            await this.activeDirectoryAuthService.sendRequest(token);
        }
            

    });


};