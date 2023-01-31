const express = require("express")
const cors = require("cors")
const app = express();

const PORT = process.env.PORT || 8080

const axios = require('axios')
app.use(express.json())
app.use(cors())
const fs = require('fs');


async function fetcher1() {
    let pres = await Promise.all(

        [
            axios.get(`https://zohocrmdata.vercel.app/getdata?page=1`),
            axios.get(`https://zohoapi2.vercel.app/getdata?page=2`),
            axios.get(`https://zohocrmdata.vercel.app/getdata?page=3`),
        ]
    )
    ////////
    let arr = [
        ...pres[0].data.data.data,
        ...pres[1].data.data.data,
        ...pres[2].data.data.data,
    ]

    return arr
}

async function fetcher2() {
    let pres = await Promise.all(

        [
            axios.get(`https://zohoapi2.vercel.app/getdata?page=4`),
            axios.get(`https://zohocrmdata.vercel.app/getdata?page=5`),
            axios.get(`https://zohoapi2.vercel.app/getdata?page=6`),
        ]
    )

    let arr = [
        ...pres[0].data.data.data,
        ...pres[1].data.data.data,
        ...pres[2].data.data.data,
    ]

    return arr
}
async function fetcher3() {
    let pres = await Promise.all(

        [
            axios.get(`https://zohocrmdata.vercel.app/getdata?page=7`),
            axios.get(`https://zohoapi2.vercel.app/getdata?page=8`),
            axios.get(`https://zohocrmdata.vercel.app/getdata?page=9`),
        ]
    )

    let arr = [
        ...pres[0].data.data.data,
        ...pres[1].data.data.data,
        ...pres[2].data.data.data,
    ]

    return arr
}

async function alldata() {
    console.log("alldata")

    let resall = await Promise.all(
        [
            fetcher1(),
            fetcher2(),
            fetcher3()
        ]
    )
    return [...resall[0], ...resall[1], ...resall[2]]
}


async function readJsonFile() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const dataAsObject = JSON.parse(data);
                resolve(dataAsObject);
            }
        });
    });
}


async function writeJsonFile(data) {
    let alldata = JSON.stringify({
        "data": data
    })
    return new Promise((resolve, reject) => {
        fs.writeFile('./data.json', alldata, (err) => {
            if (err) {
                reject(err)
                console.error(err);
            } else {
                console.log('Data has been saved to data.json file.');
                resolve(data)
            }
        })
    });
}

//////////////////functions//////////////////////

let requestin30min = false

//////////////////////timers////////////////////////


let timeoutId;

function debouncedFunction() {
    // console.log(requestin30min, 1);
    requestin30min = true
    //console.log(requestin30min, 2);
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        // The actual function implementation goes here
        //console.log(requestin30min, 3);
        requestin30min = false
        //console.log(requestin30min, 4);
        timeoutId = null;
    }, 1000 * 60 * 20);
}



setInterval(() => {
    console.log(requestin30min)
    if (requestin30min) {
        alldata().then((res) => {
            writeJsonFile(res).then((res) => {
                console.log("wrote")
            })
        })
    }
}, 1000 * 60 * 5);


//////////////////requests/////////////////////////


app.get("/getdata", (req, response) => {
    debouncedFunction()
    readJsonFile().then((res) => {
        console.log('getdata')
        response.send(res)
    })
})

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT}`)
})