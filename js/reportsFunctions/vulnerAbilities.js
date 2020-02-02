import $ from 'jquery';
import jQuery from 'jquery';

var VulnerAbilities = {
    getVulnerAbilities,
    getVulnerAbilitiesDetail,
    getVulnerabilitiesBySelectedYear,
    getVulnerabilitiesAttackBySelectedYear
}

export default VulnerAbilities;

async function getVulnerabilitiesAttackBySelectedYear(product){
    let result = {
        yearCount: 0,
        allYear: []
    };

    let allResult = await getVulnerAbilities(product);

    for(var i=0;i<product.year.length;i++){
        let obj = {
            year:0,
            attackComplexity:{
                high: 0,
                low: 0
            },
            attackVector:{
                local:0,
                network:0,
                adjacentnetwork:0,
                physical:0,
                other:0
            }    
        };
        obj.year = product.year[i];
        
        $.each(allResult.allcve, function (key, val) {
            
            if(val.year == product.year[i]){
                
                if(val.impact.baseMetricV3 !== undefined){

                    if (val.impact.baseMetricV3.cvssV3.attackComplexity == "HIGH") {
                        obj.attackComplexity.high++;
                    } else if (val.impact.baseMetricV3.cvssV3.attackComplexity == "LOW") {
                        obj.attackComplexity.low++;
                    }  

                    if (val.impact.baseMetricV3.cvssV3.attackVector == "LOCAL") {
                        obj.attackVector.local++;
                    } else if (val.impact.baseMetricV3.cvssV3.attackVector == "NETWORK") {
                        obj.attackVector.network++;
                    } else if (val.impact.baseMetricV3.cvssV3.attackVector == "ADJACENT_NETWORK") {
                        obj.attackVector.adjacentnetwork++;
                    } else if (val.impact.baseMetricV3.cvssV3.attackVector == "PHYSICAL") {
                        obj.attackVector.physical++;
                    } else {
                        obj.attackVector.other++;
                    }
                       
                }else if(val.impact.baseMetricV2 !== undefined){

                    if (val.impact.baseMetricV2.cvssV2.accessComplexity == "HIGH") {
                        obj.attackComplexity.high++;
                    } else if (val.impact.baseMetricV2.cvssV2.accessComplexity == "LOW" || val.impact.baseMetricV2.cvssV2.accessComplexity == "MEDIUM") {
                        obj.attackComplexity.low++;
                    }

                    if (val.impact.baseMetricV2.cvssV2.accessVector == "LOCAL") {
                        obj.attackVector.local++;
                    } else if (val.impact.baseMetricV2.cvssV2.accessVector == "NETWORK") {
                        obj.attackVector.network++;
                    } else if (val.impact.baseMetricV2.cvssV2.accessVector == "ADJACENT_NETWORK") {
                        obj.attackVector.adjacentnetwork++;
                    } else if (val.impact.baseMetricV2.cvssV2.accessVector == "PHYSICAL") {
                        obj.attackVector.physical++;
                    } else {
                        obj.attackVector.other++;
                    }  

                }
                
            }     
            
        });
        result.allYear.push(obj);
    }

    result.yearCount = result.allYear.length;
    return result;
}

async function getVulnerabilitiesBySelectedYear(product){
    let result = {
        yearCount: 0,
        allYear: []
    };

    let allResult = await getVulnerAbilities(product);

    for(var i=0;i<product.year.length;i++){
        let obj = {};
        obj[product.year[i]] = [];
        $.each(allResult.allcve, function (key, val) {
            
            if(val.year == product.year[i]){
                let obj2 = {};
                obj2.ID = val.cve.CVE_data_meta.ID;
                obj2.baseScore = (val.impact.baseMetricV3 && val.impact.baseMetricV3.cvssV3 && val.impact.baseMetricV3.cvssV3.baseScore) 
                || (val.impact.baseMetricV2 && val.impact.baseMetricV2.cvssV2 && val.impact.baseMetricV2.cvssV2.baseScore);
                obj2.cwe = getCWE(val.cve.problemtype);
                obj[product.year[i]].push(obj2);
            }     
            
        });
        result.allYear.push(obj);
    }

    result.yearCount = result.allYear.length;
    return result;
    
}

async function getVulnerAbilitiesDetail(product) {
    let result = {
        count: 0,
        allcve: []
    };
    let allResult = await getVulnerAbilities(product);

    $.each(allResult.allcve, function (key, val) {
        let obj = {};
        obj.ID = val.cve.CVE_data_meta.ID;
        obj.baseScore = (val.impact.baseMetricV3 && val.impact.baseMetricV3.cvssV3 && val.impact.baseMetricV3.cvssV3.baseScore) 
        || (val.impact.baseMetricV2 && val.impact.baseMetricV2.cvssV2 && val.impact.baseMetricV2.cvssV2.baseScore);
        obj.cwe = getCWE(val.cve.problemtype);
        result.allcve.push(obj);
    });

    result.count = result.allcve.length;
    return result;

}

async function getVulnerAbilities(product) {
    let result = {
        allcve: []
    };
    let fileLen = product.year.length;

    for(var i=0;i<fileLen;i++){

        let data = await getData(product.year[i]);
        
        $.each(data.CVE_Items, function (key, val) {
    
            var cvee = 0;
    
            if (val.configurations.nodes.length > 0 && cvee == 0) {
    
                $.each(val.configurations.nodes, function (key2, val2) {
    
                    if (val2.cpe_match != undefined && val2.cpe_match.length > 0 && cvee == 0) {
    
                        $.each(val2.cpe_match, function (key3, val3) {
                            if (val3.cpe23Uri.includes(product.name)) {
                                if (cvee == 0) {
                                    val.year = product.year[i];
                                    result.allcve.push(val);
                                }
                                cvee = 1;
                            }
                        });
    
                    }
    
                });
    
            }
        });

    }

    result.count = result.allcve.length;
    return result;

}

async function getData(year) {
    let promise = new Promise((resolve, reject) => {

        $.getJSON("http://127.0.0.1:8125/files/"+ year +".json", function (data) {

            resolve(data);

        });

    });

    let data = await promise;
    return data;

}

function getCWE(data) {

    var list = [];
    $.each(data.problemtype_data, (key, val) => {
        $.each(val.description, (key2, val2) => {
            list.push(val2.value);
        });
    });
    return list;

}

