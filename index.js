const express = require("express");
const cors = require("cors");
const app = express();
const request = require("request");
const unzipper = require("unzipper");
const csv = require("csvtojson");

const PORT = process.env.PORT || 8080;

let accessToken = "";
let nextGet = "";
let fullData = [];

app.use(express.json());
app.use(cors());

app.get("/getdata", async (req, res) => {

    console.log(req.query, "dcscscscwe")
    nextGet = req.query.nextGet
    accessToken = req.query.accessToken

    if (nextGet && accessToken) {
        try {
            const inputUrl = `https://www.zohoapis.com/crm/bulk/v3/read/${nextGet}/result`;
            const headers = {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            };

            request
                .get({ url: inputUrl, headers: headers })
                .pipe(unzipper.Parse())
                .on("entry", (entry) => {
                    const fileName = entry.path;
                    const type = entry.type;

                    if (fileName === `${nextGet}.csv` && type === "File") {
                        entry
                            .pipe(csv())
                            .on("data", (jsonObj) => {
                                fullData.push(JSON.parse(jsonObj.toString()));
                            })
                            .on("end", () => {
                                res.send(fullData);
                            });
                    } else {
                        entry.autodrain();
                    }
                });
        } catch (error) {
            console.error(error);
        }
    } else {
        res.send("check query")
    }
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});