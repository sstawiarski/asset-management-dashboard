import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const PDFViewer = ({ filepath, onError }) => {
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const onLoadSuccess = ({ numPages }) => {
        setPages(numPages);
    }


    return (
        <div>
            <div style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto", boxShadow: "1px 0.5px 4px #D5D5D5" }}>
                <Document
                    file={filepath}
                    loading={<CircularProgress color="secondary" />}
                    onLoadSuccess={onLoadSuccess}
                    onLoadError={onError}>
                    <Page pageNumber={currentPage} scale={0.8} />
                </Document>
            </div>


            <div style={{ textAlign: "center" }}>
                <p>Page {currentPage || (pages ? 1 : "--")} of {pages || "--"}</p>
                <Button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
                <Button
                    type="button"
                    disabled={currentPage >= pages}
                    onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
            </div>
        </div>
    );
};

export default PDFViewer;