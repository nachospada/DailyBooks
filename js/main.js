// Listen for form submit

document.getElementById('myForm').addEventListener('submit', saveExpenses);

// Save Expense
function saveExpenses(e) {
    //Get form values
    var myDate = document.getElementById('myDate').value;
    
    var myAmount = document.getElementById('myAmount').value;
    
    var myNotes = document.getElementById('myNotes').value;
    
    var expense = {
        date: myDate,
        amount: myAmount,
        notes: myNotes,
    }
    
    /*
        // Local storage test
        localStorage.setItem('test','Hello World');
        console.log(localStorage.getItem('test'));

        localStorage.removeItem('test');
        console.log(localStorage.getItem('test'));
    */
    
    // Test if expenses is null
    if(localStorage.getItem('expenses') === null){
        // Initi array
        var expenses = [];
        // Add to array
        expenses.push(expense);
        // Set to local storage
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } else {
        // Get expenses from local storage
        var expenses = JSON.parse(localStorage.getItem('expenses'));
        
        // Add expense to array
        expenses.push(expense);
        
        // Save it back to local storage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
    }
    
    // Re-fetch Expenses
    fetchExpenses();
    
    clearFields();
    
    // Prevent form from submitting
    e.preventDefault();
}

// Delete Expense
function deleteExpense(date, amount, notes){
    // Get expenses from local storage
    var expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Loop through Expenses
    for(var i = 0; i < expenses.length; i++){
        if (expenses[i].date == date && expenses[i].amount == amount && expenses[i].notes == notes) {
            // Remove from array
            expenses.splice(i, 1);
        }    
    }
    
    // Save it back to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Re-fetch Expenses
    fetchExpenses();
}


function fetchExpenses() {
    // Get expenses from local storage
    var expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Get ouput id
    var expensesResults = document.getElementById('expensesResults');
    
    var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var totalAmount = 0;
    
    // Build output
    expensesResults.innerHTML = '';
    
    for(var i = 1; i <= expenses.length; i++) {
        var date = expenses[expenses.length-i].date;
        var amount = expenses[expenses.length-i].amount;
        var notes = expenses[expenses.length-i].notes;
        
        
        var day = date.substr(8,2);
        var month = parseInt(date.substr(5,2))-1;
        
        var monthName = monthsArray[month];

        expensesResults.innerHTML += '<div class="well">'+
                                     '<h4>'+day+' '+monthName+
                                     '</h4>'+
                                     '<p>PHP '+amount+'<br>'+
                                     notes+'</p>'+
                                     '<center><a style="color:#fff" onclick="deleteExpenseConfirmation(\''+date+'\',\''+amount+'\',\''+notes+'\')" class="btn btn-danger">Delete</a></center>'+
                                     '</div>';
        
        totalAmount = totalAmount + parseInt(amount);
    }
    
    total.innerHTML = '';
    
    total.innerHTML += '<div>'+
                       '<center><h5 style="color:#9E1A1A;"><b>TOTAL</b></h5>'+
                       '<h6>PHP '+totalAmount+'</h6></center>'+
                       '</div>';
    
}

function clearFields(){
    document.getElementById('myDate').value = '';
    document.getElementById('myAmount').value = '';
    document.getElementById('myNotes').value = '';
}

function deleteAll() {
    if(localStorage.getItem('expenses') != null){
        // Initi array
        var expenses = [];
        // Set to local storage
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    fetchExpenses();
}

function deleteExpenseConfirmation(date,amount,notes) {
	var answer = confirm("Delete Item?")
	if (answer){
		deleteExpense(date,amount,notes);
	}
}

function confirmation() {
	var answer = confirm("Delete all Items?")
	if (answer){
		deleteAll();
	}
}