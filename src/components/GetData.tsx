import React, { useState, useEffect } from "react";
import * as cheerio from "cheerio";


async function fetchEMR(hrefs: string[]): Promise<string[]> {
    const mer_report_htmls: string[] = [];
    for (const href of hrefs) {
        try {
            const response = await fetch("https://web9.vghtpe.gov.tw" + href);
            if (!response.ok) {
                console.error(`Failed to fetch ${href}. Status: ${response.status}`);
                continue;
            }
            const merReport = await response.text();
            // Process the "merReport" data here...
            mer_report_htmls.push(merReport); // Add the fetched data to the array
        } catch (error) {
            console.error(`Error fetching ${href}: ${error}`);
        }
    }
    return mer_report_htmls;
}

const GetData = () => {
    const [htmlContent, setHtmlContent] = useState<string>("");

    const getData = async () => {
        const url = "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findErn";
        const response = await fetch(url);
        const data = await response.text();
        const $ = cheerio.load(data);

        
        const erDate = $('table#ernlist tbody tr:first-child td:first-child a').text();
        const formattedDate = erDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        console.log(formattedDate)

        const emr_report_response = await fetch("https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findRes&tdept=ALL");
        const emr_report = await emr_report_response.text();
        const $emr_report = cheerio.load(emr_report);

        
        let hrefs: string[] = [];

        $emr_report('table tbody tr').each((_, elem) => {
            const source = $(elem).find('td').eq(1).text().trim();
            const dateStr = $(elem).find('td').eq(3).text().trim();
            const category = $(elem).find('td').eq(6).text().trim();
            const date = new Date(dateStr);

            if (date >= new Date(formattedDate) && category === '急診' && source === 'Blood') {
                const href = $(elem).find('td a[title="resdetail"]').attr('href');
                if (href) hrefs.push(href);
            }
        });

        let mer_report_htmls: string[] = [];
        mer_report_htmls = await fetchEMR(hrefs)

        console.log(mer_report_htmls)

        const biochem = await fetch(
            "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findResd&resdtype=DCHEM&resdtmonth=03"
        );
        const biochem_html = await biochem.text();

        const emr_href = $('a[title="erndetail"]').attr("href");
        const mer_last = await fetch("https://web9.vghtpe.gov.tw" + emr_href);
        const mer_last_html = await mer_last.text();

        setHtmlContent(biochem_html);

        // Post the data to your backend
        const backendResponse = await fetch("https://yhkuo.com:8000/getData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ biochem_html, mer_last_html, mer_report_htmls }),
        });

        const backendData = await backendResponse.json();
    };

    //   useEffect(() => {
    //     getData();
    //   }, []);

    return (
        <div>
            <button className="get-button" onClick={getData}>
                Get Data
            </button>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
        </div>
    );
};

export default GetData;
