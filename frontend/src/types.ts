export type Attachment = {
    /** MongoDB ObjectId */
    _id?: string;
    /** Random unique ID */
    uuid: string;
    /** The file's original name before it was saved on the server with its UUID */
    filename: string;
    /** Full file name as it appears on the server */
    link: string;
    /** File extension, extracted from file upload mime type */
    fileType: string;
    /** The name of the user who uploaded the attachment */
    user?: string;
    /** The date and time as an ISO string that the attachment was uploaded */
    dateAdded?: string;
};

export type AlertInfo = {
    /** Opens an error alert when files are too large to be uploaded */
    type: "" | "success" | "error";
    /** Custom message to display on the error alert */
    message: string;
};

export type Manifest = {
    serial: string;
    name: string;
    quantity: number;
    notes?: string;
    serialized: boolean;
};

export type Shipment = {
    key: string;
    createdBy: string;
    created: string;
    updated?: string;
    completed?: string;
    status: "Staging" | "Completed" | "Abandoned" | "";
    shipmentType: "Incoming" | "Outgoing" | "",
    shipFrom: any;
    shipTo: any;
    specialInstructions?: string;
    contractId?: string;
    confidenceScore?: number;
    manifest: Manifest[];
    shipFromOverride?: any;
    shipToOverride?: any;
    attachments?: Attachment[]; 
}