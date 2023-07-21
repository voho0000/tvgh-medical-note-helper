import React, { useState, useEffect } from "react";
import * as cheerio from "cheerio";

const GetData = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  const getData = async () => {
    const biochem = await fetch(
      "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findResd&resdtype=DCHEM&resdtmonth=03"
    );
    const mer = await fetch(
      "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findErn"
    );
    const biochem_html = await biochem.text();
    const mer_html = await mer.text();
    const $ = cheerio.load(mer_html);
    const href = $('a[title="erndetail"]').attr("href");
    const mer_last = await fetch("https://web9.vghtpe.gov.tw" + href);
    const mer_last_html = await mer_last.text();

    setHtmlContent(biochem_html);

    // Post the data to your backend
    const backendResponse = await fetch("https://yhkuo.com:8000/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ biochem_html, mer_last_html }),
    });

    const backendData = await backendResponse.json();
    console.log(backendData);
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
