function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    })
}
async function merge() {
    let PDFDocument = PDFLib.PDFDocument;
    const filesArray = await document.getElementById('file').files;
    const mergedPdf = await PDFDocument.create();
    for (let i = 0; i < filesArray.length; i++) {
        let bytes = await readFileAsync(filesArray[i]);
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfFile = await mergedPdf.save();
    displayMergedPdf(mergedPdfFile);
}
async function displayMergedPdf(mergedPdfFile) {
    const embed = document.getElementById('embed');
    embed.src = URL.createObjectURL(new Blob([mergedPdfFile], { type: 'application/pdf' }));

    //if in safari
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        embed.remove();
        const newEmbed = `<embed id="embed" src="${embed.src}" type="application/pdf" width="100%" height="100%">`;
        document.getElementById('embed-container').innerHTML = newEmbed;
    }
}
/* 
async function share() {
    //this merges the pdf and gets a link to the merged pdf
    let PDFDocument = PDFLib.PDFDocument;
    const filesArray = await document.getElementById('file').files;
    const mergedPdf = await PDFDocument.create();
    for (let i = 0; i < filesArray.length; i++) {
        let bytes = await readFileAsync(filesArray[i]);
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const file = await mergedPdf.save();
    let filename = 'share.pdf';
    let type = 'application/pdf';
    let binaryData = [];
    binaryData.push(file);
    url = URL.createObjectURL(new Blob(binaryData, { type: type }))

    //this grabs the pdf from the url and shares it using the web share api
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const pdf = new File([buffer], "noodlenotebook.com.pdf", { type: "application/pdf" });
    const files = [pdf];
    //check if the web share api is supported
    if (navigator.canShare && navigator.canShare({ files })){
        await navigator.share({ files });
    }
    else {
        alert("This feature is supported on Chrome(Windows) & Safari(MacOS)");
    }
}
*/