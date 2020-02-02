import VulnerAbilities from './vulnerAbilities';

var ExportResult = {
    getVulnerability,
    getVulnerabilityDetail,
    getVulnerabilityBySelectedYear,
    getVulnerabilityAttackBySelectedYear
}

export default ExportResult;

async function getVulnerability(product,callback){
   let result = await VulnerAbilities.getVulnerAbilities(product);
   callback(result);
}

async function getVulnerabilityDetail(product,callback){
    let result = await VulnerAbilities.getVulnerAbilitiesDetail(product);
    callback(result);
 }

 async function getVulnerabilityBySelectedYear(product,callback){
    let result = await VulnerAbilities.getVulnerabilitiesBySelectedYear(product);
    callback(result);
 }

 async function getVulnerabilityAttackBySelectedYear(product,callback){
    let result = await VulnerAbilities.getVulnerabilitiesAttackBySelectedYear(product);
    callback(result);
 }
 
 