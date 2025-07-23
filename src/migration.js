import * as fs from "fs";
import fetch from "node-fetch";
import { migrationLogger as logger, migrationErrorLogger as errorLogger } from "./logger.js";
import env from "custom-env";

env.env(true).config();

const headers = {
    "Authorization": `SSWS ${process.env.OKTA_API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "UserMigration"
};

fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
        errorLogger.error(`Error reading file from disk: ${err}`);
    } else {
        const users = JSON.parse(data);

        users.forEach(user => {
            create(user).then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        const errorJson = {
                            response: JSON.parse(text),
                            data: user
                        };
                        errorLogger.error(errorJson);
                    });
                } else {
                    logger.info(user);
                }
            }).catch(error => console.error("Failed to create user", error));
        });
    }
});

async function create(user) {
    const json = {
        "profile": {
            "login": user.login,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName
        }
    };

    console.log(json);

    const options = {
        method: "POST",
        body: JSON.stringify(json),
        headers: headers
    };

    return await fetch(process.env.IMPORT_URI, options);
}
