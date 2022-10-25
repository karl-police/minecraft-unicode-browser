// Module definition
const unicodeData_Module = new function() {
//


// https://unicode.org/Public/UNIDATA/UnicodeData.txt"
const URL_UnicodeData = "assets/unicode_data/UnicodeData.txt"

// https://unicode.org/Public/UNIDATA/NameAliases.txt
const URL_UnicodeNameAliases = "assets/unicode_data/NameAliases.txt"


function loadTXTDataFile(url) {
    return new Promise(function(resolve, reject) {
        fetch(url, {}).then(function(response) {
            response.text().then(function(text) {
                resolve(text)
            })
        })
    })
}

// Used to genereate a JSON Table for the Unicode Data
async function generateJSONTable() {
    var CSV_UnicodeData = await loadTXTDataFile(URL_UnicodeData)
    var CSV_UnicodeNameAliases = await loadTXTDataFile(URL_UnicodeNameAliases)

    var CSV_LineSeparated_UnicodeData = CSV_UnicodeData.split("\n") // split it by line

    const UnfinishedSeparated_UnicodeData = {}

    // This part will loop through the line separated arrays.
    for (let i=0; i < CSV_LineSeparated_UnicodeData.length; i++) {
        let splitCollectionBlock = CSV_LineSeparated_UnicodeData[i].split(";")
        
        Object.assign(UnfinishedSeparated_UnicodeData, {[i]: [splitCollectionBlock]})
    }


    // The next part are the NameAliases
    const UnfinishedSeparated_UnicodeNameAliases = {}
    CSV_UnicodeNameAliases = CSV_UnicodeNameAliases.replace(/^#.*\n?/gm, '') // Remove all the # comments
    CSV_UnicodeNameAliases = CSV_UnicodeNameAliases.replace(/^\s*[\r\n]/gm, '') // Remove most of the empty lines

    var CSV_LineSeparated_UnicodeNameAliases = CSV_UnicodeNameAliases.split("\n") // split it by line


    // Loop through the line separated arrays.
    for (let i=0; i < CSV_LineSeparated_UnicodeNameAliases.length; i++) {

        // Skip if there's something empty.
        if (CSV_LineSeparated_UnicodeNameAliases[i] == "") {
            continue
        }

        let splitCollectionBlock = CSV_LineSeparated_UnicodeNameAliases[i].split(";")
        
        Object.assign(UnfinishedSeparated_UnicodeNameAliases, {[i]: [splitCollectionBlock]})
    }


    const JSON_UnicodeNameAliases = {}

    for (let i=0; i < Object.keys(UnfinishedSeparated_UnicodeNameAliases).length; i++) {
        // The first element, is the Unicode ID, that is going to be put as the main index.
        var currentArrayBlock = UnfinishedSeparated_UnicodeNameAliases[i][0]

        var unprocessed_UnicodeID = currentArrayBlock[0]

        // If it doesn't exist, create an index for the UnicodeID
        if (!JSON_UnicodeNameAliases[unprocessed_UnicodeID]) {
            JSON_UnicodeNameAliases[unprocessed_UnicodeID] = {}
        }

        // Put all of the types in one array.
        Object.assign(JSON_UnicodeNameAliases[unprocessed_UnicodeID], {
            [currentArrayBlock[2]]: currentArrayBlock[1]
        })
    }


    const JSON_UnicodeData = {}

    // This part will create a table out of it
    for (let i=0; i < Object.keys(UnfinishedSeparated_UnicodeData).length; i++) {
        // We don't need all of the Unicodes
        /*if (unprocessed_UnicodeID == "10000") {
            break
        }*/

        // The first element, is the Unicode ID, that is going to be put as the main index.
        var currentArrayBlock = UnfinishedSeparated_UnicodeData[i][0]

        var unprocessed_UnicodeID = currentArrayBlock[0]

        // If it doesn't exist, create an index for the UnicodeID
        if (!JSON_UnicodeData[unprocessed_UnicodeID]) {
            JSON_UnicodeData[unprocessed_UnicodeID] = {}
        }

        Object.assign(JSON_UnicodeData[unprocessed_UnicodeID], {
            name: currentArrayBlock[1],
            altName: currentArrayBlock[10],
        })

        if (JSON_UnicodeNameAliases[unprocessed_UnicodeID]) {
            Object.assign(JSON_UnicodeData[unprocessed_UnicodeID], {
                aliasData: JSON_UnicodeNameAliases[unprocessed_UnicodeID]
            })
        }
    }

    var exportTextarea = document.createElement("textarea")
    exportTextarea.innerText = JSON.stringify(JSON_UnicodeData)

    document.getElementById("header_container").append(exportTextarea)
}
// This is used to generate the JSON Table for the Unicode Data
//generateJSONTable()




// Function to generate unicode escapes
function createUnicodeEscapesMC(stringInput) {
    var result = ""
    var resultCollections = []
    
    var splittedStringCollections = stringInput.split("\n")

    var stringCollections = []
    stringCollections = splittedStringCollections

    /*var stringSingleCollections = []

    for (let i=0; i < splittedStringCollections.length; i++) {
        stringSingleCollections = stringSingleCollections.concat(splittedStringCollections[i].split(""))
    }

    for (let i=0; i < stringSingleCollections.length; i++) {
        stringCollections[i] = stringSingleCollections.splice(0, 16) // for offset
    }*/

    for (let i=0; i < stringCollections.length; i++) {
        var extractedStringCollection = stringCollections[i].split("")
        
        for (let i_2=0; i_2 < extractedStringCollection.length; i_2++) {
            let unicodeValue = extractedStringCollection[i_2].charCodeAt().toString("16")
            let unicodeEscape = "\\u" + ("0000" + unicodeValue).slice(-4)

            extractedStringCollection[i_2] = unicodeEscape
        }

        resultCollections[i] = extractedStringCollection // insert into array
    }

    for (let i=0; i < resultCollections.length; i++) {
        let resultCollectionBlock = resultCollections[i]
        let preResult = ""

        preResult += "\""
        for (let i_2=0; i_2 < resultCollectionBlock.length; i_2++) {
            if ((i_2 + 1) != resultCollectionBlock.length) {
                preResult += resultCollectionBlock[i_2]
            } else {
                preResult += resultCollectionBlock[i_2] + "\",\n"
            }
        }

        result += preResult
    }

    return result
}
//unicodeData_Module.createUnicodeEscapesMC()
//this.createUnicodeEscapesMC = createUnicodeEscapesMC



// unicodeData_StoredJSON is used, which is in a separate file and gets included before this one in the HTML file.
/*
    structure is:
    unicodeID: {
        name:
        altName:
        aliasData:
            types from NameAliases.txt
    }
*/


// This function retrieves the display name of a unicode
function getUnicodeDisplayName(unicodeID) {
    var unicodeID_data = unicodeData_StoredJSON[unicodeID]

    if (unicodeID_data) {
        if (unicodeID_data.name && (unicodeID_data.name != "") && (unicodeID_data.name != "<control>")) {
            return unicodeID_data.name
        } else if (unicodeID_data.altName && (unicodeID_data.altName != "") && (unicodeID_data.altName != "<control>")) {
            return unicodeID_data.altName
        } else if (unicodeID_data.aliasData) {
            if (unicodeID_data.aliasData?.control && (unicodeID_data.aliasData.control != "") && (unicodeID_data.aliasData.control != "<control>")) {
                return unicodeID_data.aliasData.control
            } else if (unicodeID_data.aliasData.figment && (unicodeID_data.aliasData.figment != "") && (unicodeID_data.aliasData.figment != "<control>")) {
                return unicodeID_data.aliasData.figment
            }
        }

        return "" // otherwise return an empty string
    }
}



// export module functions
this.getUnicodeDisplayName = getUnicodeDisplayName

} // end of module