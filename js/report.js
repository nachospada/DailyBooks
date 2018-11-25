function fetchExpenses() {
    // Get expenses from local storage
    var expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Get ouput id
    var tableResults = document.getElementById('tableResults');
    
    var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    var totalAmount = 0;
    
    // Build output
    
    for(var i = 1; i <= expenses.length; i++) {
        var date = expenses[expenses.length-i].date;
        var amount = expenses[expenses.length-i].amount;
        var notes = expenses[expenses.length-i].notes;
        
        
        var day = date.substr(8,2);
        var month = parseInt(date.substr(5,2))-1;
        
        var monthName = monthsArray[month];
        
       
        tableResults.innerHTML += '<tr>'+
                                     '<td>'+day+' '+monthName+'</td>'+
                                     '<td>php '+amount+'</td>'+
                                     '<td>'+notes+'</td>'+
                                  '</tr>';
        
        
        
        
        totalAmount = totalAmount + parseInt(amount);
    }
    
    totalReport.innerHTML = '';
    
    totalReport.innerHTML += '<div class="container" style="margin-top: 20px;">'+
                       '<p align="right"><span style="color:#9e1a1a;"><b>TOTAL </b></span>PHP '+totalAmount+'</p>'+
                       '</div>';
    
}

function createPDF() {
    
    var totalAmount = 0;
    
    var table = document.querySelector('table');
    var columns = [];
    var rows = [];        

    for ( var i = 1; i < table.rows.length; i++ ) {
        rows.push([table.rows[i].cells[0].innerHTML, table.rows[i].cells[1].innerHTML, table.rows[i].cells[2].innerHTML]);
    }

    for ( var i = 0; i < 3; i++ ){
        columns.push(table.rows[0].cells[i].innerHTML);
    }
    
    for ( var i = 0 ; i < table.rows.length-1; i++ ) {
        totalAmount = totalAmount + parseInt(rows[i][1].substring(4,10));
    }

    var pdf = new jsPDF('p', 'pt');

    pdf.autoTable(columns, rows);
    var finalY = pdf.autoTable.previous.finalY;  
    pdf.setTextColor(255,0,0);
    pdf.text(pdf.internal.pageSize.getWidth()-120, finalY+30, 'TOTAL ', { align: 'right' });
    pdf.setTextColor(0,0,0);
    pdf.text(pdf.internal.pageSize.getWidth()-115, finalY+30, 'php '+totalAmount);

    pdf.save('report.pdf');

//    var string = pdf.output('datauristring');
//    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
//
//    var x = window.open();
//    x.document.open();
//    x.document.write(iframe);
//    x.document.close();
    
//    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
//        window.open(pdf.output('bloburl'), '_blank');
//    } else {
//         pdf.save('report.pdf');
//    }
}