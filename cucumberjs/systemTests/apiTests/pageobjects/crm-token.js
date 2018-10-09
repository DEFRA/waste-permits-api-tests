const AdalNode = require('adal-node')
const webdriver = require('selenium-webdriver')
const By = webdriver.By;
const until = webdriver.until;
const request = require("request");
const chai = require("chai");
const fs = require('fs');
const configCRM = require("../../../../configCRM").configCRM;

const authorityURL = configCRM.authorityURL;
//CRM Organization URL
const resource = configCRM.resource;
//Dynamics 365 Client Id when registered in Azure
const clientID = configCRM.clientID;
const uRL = configCRM.sendUrl;

class ActiveDirectoryAuthService {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }
    
    async sendRequest(token) {
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        let today = new Date().toLocaleString();
        const options = {
            method: 'GET',
            url: uRL,
            qs:
            {
                '$select': 'defra_name',
                '$top': '3',
                '$orderby': 'defra_name desc'
            },
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            },
            json: true
        };

        request(options, function (error, response, body) {
           // console.log("Response:- " + JSON.stringify(response));

            fs.appendFile('CRM Logs.txt','\n'+today+ JSON.stringify(response)+'\n'+'------------------------', function (err) {
                if (err) throw err;
            });
        });
    }

    async sleep() {
        return await this.browser.sleep(3600000);
    }

    async getToken() {
        //wait for 1 hour
        await this.sleep();
        return new Promise((resolve, reject) => {
            // Make the token request
            const authorityHostUrl = configCRM.authorityHostUrl;
            const tenant = configCRM.tenant;
            const authorityUrl = authorityHostUrl + '/' + tenant
            const clientId = clientID // Application Id of app registered under AAD.
            const clientSecret = configCRM.clientSecret;
            const resource = configCRM.resource;


            const AuthenticationContext = AdalNode.AuthenticationContext
            const context = new AuthenticationContext(authorityUrl)

            return context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function (err, tokenResponse) {
                if (err) {
                    reject(err)
                } else {
                    const token = tokenResponse.accessToken
                    if (token) {
                        resolve(token)
                    } else {
                        const error = new Error(`Error obtaining Active Directory auth token: ${JSON.stringify(tokenResponse)}`)
                        reject(error)
                    }
                }
            })
        })
    }
}

module.exports.ActiveDirectoryAuthService = ActiveDirectoryAuthService;
