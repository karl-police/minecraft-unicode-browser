// included in .html

var __DEBUG = false; // For debugging

var _baseURL = ""

if (__DEBUG) {
    _baseURL = "https://karl-police.github.io/minecraft-unicode-browser/"
}

const html_itemListingElement = document.getElementById("listing-container")

// Function to create the unicode item element
function createUnicodeItemElement(options) {
    let documentFragment = document.createDocumentFragment()

    /*<div class="item-container _nodesc">
        <div class="item">
            <div class="item-image">
                <img class="item-img" style="image-rendering: pixelated; width: 64px; height: 64px;">
            </div>
            <div class="item-desc-container">
                <div class="item-desc-unicode"><span>U+0002</span></div>
                <div class="item-desc-name"><span>Start of Text</span></div>
            </div>
        </div>
    </div>*/

    let itemContainer = document.createElement("div")
    itemContainer.className += "item-container"
    itemContainer.setAttribute("data-unicode_id", options.unicodeID)

    let itemInnerContainer = document.createElement("div")
    itemInnerContainer.className = "item"

    let itemImageContainer = document.createElement("div")
    itemImageContainer.className = "item-image"

    let itemImage
    if (options.type != "CSS") {
        itemImage = document.createElement("img")
    } else if (options.type == "CSS") {
        itemImage = document.createElement("div")
    }
    itemImage.className = "item-img"

    if (options.type != "CSS") {
        itemImage.src = options.imageSrc
    } else if (options.type == "CSS") {
        itemImage.style.background = `url(${options.imageSrc})`
        itemImage.style.backgroundSize = "1024px" // for zoom
        itemImage.style.backgroundPositionX = (options.posX * 4) + "px"
        itemImage.style.backgroundPositionY = (options.posY * 4) + "px"
        itemImage.style.display = "inline-block"
    }
    
    itemImage.style.imageRendering = "pixelated"
    itemImage.style.width = "64px"
    itemImage.style.height = "64px"

    itemImageContainer.append(itemImage) // img
    itemInnerContainer.append(itemImageContainer) // image container

    let itemDescContainer = document.createElement("div")
    itemDescContainer.className += "item-desc-container"

    let itemDescUnicode = document.createElement("div")
    itemDescUnicode.className = "item-desc-unicode"

    let itemDescUnicodeSpan = document.createElement("span")
    itemDescUnicodeSpan.innerText = "U+" + options.unicodeID
    itemDescUnicode.append(itemDescUnicodeSpan) // unicode span

    let itemDescName = document.createElement("div")
    itemDescName.className = "item-desc-name"

    let itemDescNameSpan = document.createElement("span")
    itemDescName.innerText = options.unicodeName
    itemDescName.append(itemDescNameSpan) // name span

    itemDescContainer.append(itemDescUnicode) // unicode description
    itemDescContainer.append(itemDescName) // unicode name

    itemInnerContainer.append(itemDescContainer) // description container
    itemContainer.append(itemInnerContainer) // item class div

    documentFragment.append(itemContainer)

    html_itemListingElement.append(documentFragment)
}




// Function to set up one unicode_page_%s image
function setupUnicodePageImage(unicodePage_index, displayType) {
    imagesheet_handler_Module.regularImageSheet_extract({
        sheetImgSrc: _baseURL + "assets/textures/font/unicode_page_" + unicodePage_index + ".png",
        sheetWidth: 256,
        sheetHeight: 256,
    
        cropWidth: 16,
        cropHeight: 16,
    
        offsetX: 16,
        offsetY: 16,
    
        rowAmount: 16,
        columnAmount: 16,
    }).then(function(result) {
        for (let i=1; i < Object.keys(result.images).length + 1; i++) {
            let unicodeHexValue = (i-1).toString("16").toUpperCase();

            if ((i-1) < 16) {
                unicodeHexValue = "0" + unicodeHexValue
            }

            let unicodeID_value = unicodePage_index.toUpperCase() + unicodeHexValue

            createUnicodeItemElement({
                imageSrc: result.images[i],
                unicodeID: unicodeID_value,
                unicodeName: unicodeData_Module.getUnicodeDisplayName(unicodeID_value),
            })
        }
    })
}


// Function to set up one unicode_page_%s image wtih CSS
function setupUnicodePageCSSImage(unicodePage_index) {
    var result = imagesheet_handler_Module.regularImageSheet_extractCSS({
        sheetImgSrc: _baseURL + "assets/textures/font/unicode_page_" + unicodePage_index + ".png",
        sheetWidth: 256,
        sheetHeight: 256,
    
        cropWidth: 16,
        cropHeight: 16,
    
        offsetX: 16,
        offsetY: 16,
    
        rowAmount: 16,
        columnAmount: 16,
    })
    
    for (let i=1; i < Object.keys(result.images).length + 1; i++) {
        let unicodeHexValue = (i-1).toString("16").toUpperCase();

        if ((i-1) < 16) {
            unicodeHexValue = "0" + unicodeHexValue
        }

        let unicodeID_value = unicodePage_index.toUpperCase() + unicodeHexValue

        createUnicodeItemElement({
            type: "CSS",
            imageSrc: "assets/textures/font/unicode_page_" + unicodePage_index + ".png",
            posX: result.images[i].posX,
            posY: result.images[i].posY,
            unicodeID: unicodePage_index.toUpperCase() + unicodeHexValue,
            unicodeName: unicodeData_Module.getUnicodeDisplayName(unicodeID_value),
        })
    }
}


// Function to create unicode_page_%s images
function setupUnicodePageImages(displayType) {
    for (let i=0; i <= 255; i++) {
        let hexValue = (i).toString("16")

        if (i < 16) {
            hexValue = "0" + hexValue
        }

        if (i == 8) { // skip because 08 does not exist
            continue
        }

        if (i >= 216 && i <= 248) { // skip as d8 - f8 does not exist
            continue
        }

        if (displayType != "CSS") {
            setupUnicodePageImage(hexValue)
        } else if (displayType == "CSS") {
            setupUnicodePageCSSImage(hexValue)
        }
    }
}

// Sets up Nonlatin EU unicode chars
function setupNonlatinEUPage() {
    var nonlatinEUChars = minecraft_StoredData_UnicodeDefaultJSON.unicodeNonlatin_European.chars
    //var unprocessed_nonlatinEUChars_array = []
    var new_nonlatinEUChars_array = []

    /*for (let i=0; i < nonlatinEUChars.length; i++) {
        unprocessed_nonlatinEUChars_array = unprocessed_nonlatinEUChars_array.concat(nonlatinEUChars[i].split(""))
    }*/

    for (let i=0; i < nonlatinEUChars.length; i++) {
        for (let char of nonlatinEUChars[i]) {
            if (char != "") {
                new_nonlatinEUChars_array.push(char)
            }
        }
    }

    /*for (let i=0; i < new_nonlatinEUChars_array.length; i++) {
        var unicodeID_value = new_nonlatinEUChars_array[i].charCodeAt().toString("16").toUpperCase()
        unicodeID_value = ("0000" + unicodeID_value).slice(-4)

        if (unicodeID_value == "D800") {
            new_nonlatinEUChars_array.splice(new_nonlatinEUChars_array.indexOf(new_nonlatinEUChars_array[i]), 1)
        }
    }*/

    var result = imagesheet_handler_Module.regularImageSheet_extractCSS({
        sheetImgSrc: _baseURL + "assets/textures/font/nonlatin_european.png",
        sheetWidth: 128,
        sheetHeight: 500,
    
        cropWidth: 16,
        cropHeight: 16,
    
        offsetX: 16,
        offsetY: 16,
    
        rowAmount: 16,
        columnAmount: 65,

        //charToStopAt: 1028,
    })

    for (let i=1; i < Object.keys(result.images).length + 1; i++) {
        let unicodeID_value = new_nonlatinEUChars_array[i-1].codePointAt().toString("16").toUpperCase() // codePointAt

        if (unicodeID_value.length <= 4) {
            unicodeID_value = ("0000" + unicodeID_value).slice(-4)
        }

        createUnicodeItemElement({
            type: "CSS",
            imageSrc: "assets/textures/font/nonlatin_european.png",
            posX: result.images[i].posX,
            posY: result.images[i].posY,
            unicodeID: unicodeID_value,
            unicodeName: unicodeData_Module.getUnicodeDisplayName(unicodeID_value),
        })
    }
}


// Sets up a Char JSON page
function setupCharJSONPage_CSS(options) {
    let characterArray = options.characterArray

    var new_charsArray = []

    for (let i=0; i < characterArray.length; i++) {
        for (let char of characterArray[i]) {
            if (char != "") {
                new_charsArray.push(char)
            }
        }
    }


    /*  sheetImgSrc: options.sheetImageSrc,
        sheetWidth: options.sheetWidth,
        sheetHeight: options.sheetHeight,
    
        cropWidth: options.cropWidth,
        cropHeight: options.cropHeight,
    
        offsetX: options.offsetX,
        offsetY: options.offsetY,
    
        rowAmount: options.rowAmount,
        columnAmount: options.columnAmount,

        charToStopAt: options.charToStopAt,*/

    var result = imagesheet_handler_Module.regularImageSheet_extractCSS({
        sheetImgSrc: options.sheetImageSrc,
        sheetWidth: options.sheetWidth,
        sheetHeight: options.sheetHeight,
    
        cropWidth: options.cropWidth,
        cropHeight: options.cropHeight,
    
        offsetX: options.offsetX,
        offsetY: options.offsetY,
    
        rowAmount: options.rowAmount,
        columnAmount: options.columnAmount,

        charToStopAt: options.charToStopAt,
    })

    for (let i=1; i < Object.keys(result.images).length + 1; i++) {
        let unicodeID_value = new_charsArray[i-1].codePointAt().toString("16").toUpperCase() // codePointAt

        if (unicodeID_value.length <= 4) {
            unicodeID_value = ("0000" + unicodeID_value).slice(-4)
        }

        createUnicodeItemElement({
            type: "CSS",
            imageSrc: "assets/textures/font/nonlatin_european.png",
            posX: result.images[i].posX,
            posY: result.images[i].posY,
            unicodeID: unicodeID_value,
            unicodeName: unicodeData_Module.getUnicodeDisplayName(unicodeID_value),
        })
    }
}


// A function to clear the listing container.
function clearListingContainer() {
    html_itemListingElement.innerHTML = ""
}


// Function to load website with parameters.
function startLoadSite() {
    setupUnicodePageCSSImage("00")
}


function browseUnicode_NonlatinEU() {
    clearListingContainer() // Clear the listing container.
    //setupNonlatinEUPage()
    setupCharJSONPage_CSS({
        characterArray: minecraft_StoredData_UnicodeDefaultJSON.unicodeNonlatin_European.chars,
        
        sheetImageSrc: _baseURL + "assets/textures/font/nonlatin_european.png",
        sheetWidth: 128,
        sheetHeight: 500,
        
        cropWidth: 16,
        cropHeight: 16,

        offsetX: 16,
        offsetY: 16,

        rowAmount: 16,
        columnAmount: 65, 

        //charToStopAt: 1028,
    })
}

function browseUnicode_AllUnicodePages() {
    clearListingContainer()
    setupUnicodePageImages("CSS")
}

var html_btnNonlatinEU = document.getElementById("btn-nonlatin-eu")
html_btnNonlatinEU.addEventListener("click", browseUnicode_NonlatinEU)

var html_btnAllUnicodePages= document.getElementById("btn-all-unicode_pages")
html_btnAllUnicodePages.addEventListener("click", browseUnicode_AllUnicodePages)


//setupUnicodePageImages()
//setupUnicodePageImage("00")

//setupUnicodePageImages("CSS")
//setupUnicodePageCSSImage("00")

startLoadSite()