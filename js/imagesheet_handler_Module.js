// Module definition
const imagesheet_handler_Module = new function() {
//

const __DEBUG = false; // For debugging locally



function canvas_cropImg(imgURI, width, height, posX, posY) {
    return new Promise(function(resolve, rejected) {
        var transform_canvas = document.createElement("canvas")
        var img_src = new Image()

        img_src.src = imgURI;
        
        if (__DEBUG) {
            img_src.crossOrigin = "anonymous"
        }

        img_src.onload = function() {
            transform_canvas.width = width
            transform_canvas.height = height

            var canvas2D = transform_canvas.getContext("2d")
            canvas2D.drawImage(img_src, posX, posY, width, height, 0, 0, width, height)

            if (canvas2D && transform_canvas) {
                resolve(transform_canvas)
            }
        }
    })
}

function cropImage(imgURI, width, height, posX, posY) {
    return new Promise(function(resolve, rejected) {
        canvas_cropImg(imgURI, width, height, posX, posY).then(function(res) {
            resolve(res.toDataURL("image/png").toString())
        })
    })
}


class imageSheet_options {
    /**
     * 
     * @param {imageSheet_options} table 
     */
    constructor(table) {
        Object.assign(this, table)
    }

    /**
     * Source of the image sheet.
     */
    sheetImgSrc

    sheetWidth
    sheetHeight

    cropWidth
    cropHeight

    offsetX
    offsetY

    rowAmount
    columnAmount

    charToStopAt
}


// A function to generate separate images from an image sheet.
/**
 * @param {imageSheet_options} options A table to configure settings.
 */
function regularImageSheet_extract(options) {
    return new Promise(function(resolve, reject) {
        if (!options) {
            options = {}
        }
    
        sheetImgSrc = options.sheetImgSrc
        sheetWidth = options.sheetWidth
        sheetHeight = options.sheetHeight
    
        cropWidth = options.cropWidth
        cropHeight = options.cropHeight

        offsetX = options.offsetX
        offsetY = options.offsetY

        rowAmount = options.rowAmount
        columnAmount = options.columnAmount

        charToStopAt = options.charToStopAt


        let totalPosCounter = 1;
        let rowPosCounter = 1;
        let columnPosCounter = 1;

        let collectionTable = {};
        collectionTable.images = {};

        /* canvas */
        var transform_canvas = document.createElement("canvas")
        var img_src = new Image()

        img_src.src = sheetImgSrc;
        
        if (__DEBUG) {
            img_src.crossOrigin = "anonymous"
        }

        img_src.onload = function() {
            transform_canvas.width = cropWidth
            transform_canvas.height = cropHeight

            var canvas2D = transform_canvas.getContext("2d")

            for (let col_i=1; col_i <= columnAmount; col_i++) {
                for (let row_i=1; row_i <= rowAmount; row_i++) {
                    canvas2D.drawImage(img_src, ((rowPosCounter - 1) * offsetX), ((columnPosCounter - 1) * offsetY), cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
                    
                    var dataURL = transform_canvas.toDataURL("image/png").toString()

                    Object.assign(collectionTable.images, {[totalPosCounter]: dataURL})
    
                    // break if charToStopAt was reached
                    if (totalPosCounter == charToStopAt) {
                        break
                    }
                    
                    canvas2D.clearRect(0, 0, transform_canvas.width, transform_canvas.height)

                    rowPosCounter += 1;
                    totalPosCounter += 1;
                }

                columnPosCounter += 1;
                rowPosCounter = 1; // Reset
            }

            if (collectionTable) {
                resolve(collectionTable)
            }
        }
    })
}


// A function that will use the image sheet to display single images with CSS
/**
 * @param {imageSheet_options} options A table to configure settings.
 */
function regularImageSheet_extractCSS(options) {
    if (!options) {
        options = {}
    }

    sheetImgSrc = options.sheetImgSrc
    sheetWidth = options.sheetWidth
    sheetHeight = options.sheetHeight

    cropWidth = options.cropWidth
    cropHeight = options.cropHeight

    offsetX = options.offsetX
    offsetY = options.offsetY

    rowAmount = options.rowAmount
    columnAmount = options.columnAmount

    charToStopAt = options.charToStopAt


    let totalPosCounter = 1;
    let rowPosCounter = 1;
    let columnPosCounter = 1;

    let collectionTable = {};
    collectionTable.images = {};

    for (let col_i=1; col_i <= columnAmount; col_i++) {
        for (let row_i=1; row_i <= rowAmount; row_i++) {

            Object.assign(collectionTable.images, {[totalPosCounter]: {
                posX: -((rowPosCounter - 1) * offsetX),
                posY: -((columnPosCounter - 1) * offsetY),
            }})

            // break if charToStopAt was reached
            if (totalPosCounter == charToStopAt) {
                break
            }

            rowPosCounter += 1;
            totalPosCounter += 1;
        }

        columnPosCounter += 1;
        rowPosCounter = 1; // Reset
    }

    return collectionTable
}


// export for module
this.cropImage = cropImage
this.regularImageSheet_extract = regularImageSheet_extract

this.regularImageSheet_extractCSS = regularImageSheet_extractCSS

this.imageSheet_options = imageSheet_options

} // end of module