import { Attachment } from "../types";
const JSZip = require('jszip');

/**
 * Downloads an array of Attachment objects as a zip file
 * 
 * @param files array of Attachment objects to download
 * @param folderName the name of the folder to zip (i.e. the name of the final zip file)
 * @returns whether or not the download operation successed
 */
export const downloadAsZip = async (files: Attachment[], folderName: string): Promise<boolean> => {
    try {
        const zipFile = new JSZip();
        const urls = files.map(file => `${process.env.REACT_APP_API_URL}/attachments/${file.link}`);
        const blobs = await Promise.all(urls.map(url => fetch(url).then(response => response.blob()).then(blob => blob.arrayBuffer())));
        
        for (let i = 0; i < blobs.length; i++) {
            zipFile.file(files[i].filename, blobs[i]);
        }
    
        const finalFile = await zipFile.generate({ type: "blob" });
        var url = window.URL.createObjectURL(finalFile);
        var a = document.createElement('a');
        a.href = url;
        a.download = folderName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again     

        return true;
        
    } catch (err) {
        console.log(err);
        return false;
    }
   
};