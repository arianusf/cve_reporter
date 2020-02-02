import $ from 'jquery';
import jQuery from 'jquery';
import ExportResult from './reportsFunctions/exportResult'

var isBusy = 0;
var productName = "";
var reportYear = "";
$(document).ready(function(){
    clearDashboard();
    $("#product-set").click(()=>{
        let name = $("#product-name").val();
        if(name.length > 0){
            productName = name;
            $("#label-product").html(name);
        }else{
            alert("enter product name");
        }
    });

    $("#year-set").click(()=>{
        let year = $("#year-name").val();
        if(year.length > 0){
            reportYear = year.replace(/\s/g, '').split(",");
            $("#label-year").html(year);
        }else{
            alert("enter report year");
        }
    });

    $("#get-product-list-full").click(()=>{
        if(isBusy == 1){
            alert("wait for previous proccess");
            return false;
        }
        if(productName.length > 0 && reportYear.length > 0){
            let name = productName;
            let year = reportYear;
            isBusy = 1;
            ExportResult.getVulnerability({name,year},(result)=>{
                $("#label-count").html(result.count);
                $("textarea").val(JSON.stringify(result));
                isBusy = 0;
            });
        }else{
            alert("enter product name and report year");
        }
    });

    $("#get-product-list").click(()=>{
        if(isBusy == 1){
            alert("wait for previous proccess");
            return false;
        }
        if(productName.length > 0 && reportYear.length > 0){
            let name = productName;
            let year = reportYear;
            isBusy = 1;
            ExportResult.getVulnerabilityDetail({name,year},(result)=>{
                $("#label-count").html(result.count);
                $("textarea").val(JSON.stringify(result));
                isBusy = 0;
            });
        }else{
            alert("enter product name and report year");
        }
    });
    
    $("#get-year-report").click(()=>{
        if(isBusy == 1){
            alert("wait for previous proccess");
            return false;
        }
        if(productName.length > 0 && reportYear.length > 0){
            let name = productName;
            let year = reportYear;
            isBusy = 1;
            ExportResult.getVulnerabilityBySelectedYear({name,year},(result)=>{
                $("#label-count").html(result.count);
                $("textarea").val(JSON.stringify(result));
                isBusy = 0;
            });
        }else{
            alert("enter product name and report year");
        }
    });
    
    $("#get-cve-attack").click(()=>{
        if(isBusy == 1){
            alert("wait for previous proccess");
            return false;
        }
        if(productName.length > 0 && reportYear.length > 0){
            let name = productName;
            let year = reportYear;
            isBusy = 1;
            ExportResult.getVulnerabilityAttackBySelectedYear({name,year},(result)=>{
                $("#label-count").html(result.count);
                $("textarea").val(JSON.stringify(result));
                isBusy = 0;
            });
        }else{
            alert("enter product name and report year");
        }
    });

    $("#prettyPrint").click(()=>{
        prettyPrint();
    });
});

function clearDashboard(){
    $("textarea").val("");
    $("#product-name").val("");
    $("#year-name").val("");
}

function prettyPrint(){
    var ugly = document.getElementById('result-textarea').value;
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 4);
    document.getElementById('result-textarea').value = pretty;
}