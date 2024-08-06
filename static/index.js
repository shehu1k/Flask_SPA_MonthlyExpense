const btns = document.querySelectorAll('div#main_options .btn');

btns.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        const current_primary_button = document.querySelector('div#main_options .btn-primary');
        current_primary_button?.classList.replace('btn-primary','btn-secondary')
        btn.classList.replace('btn-secondary','btn-primary')
    });
});


const btn_add_exp = document.querySelector('#add');
btn_add_exp.addEventListener('click',()=>{
    document.querySelectorAll('section').forEach(el=>{
        el.style.display = 'none';
    });
    document.querySelector('#add_expense').style.display = 'block';
});

const btn_show_exp = document.querySelector('#show');
btn_show_exp.addEventListener('click',()=>{
    document.querySelectorAll('section').forEach(el=>{
        el.style.display = 'none';
        form_show_exp.reset();
    });
    document.querySelector('#show_expense').style.display = 'block';
});


document.addEventListener('DOMContentLoaded', () => {
    const form_add_exp = document.querySelector('section#add_expense > form');
    const form_add_exp_result_alert = document.querySelector('#add-exp-result-alert');
    form_add_exp.addEventListener('submit',(e)=>{
        e.preventDefault()
        const formdata = new FormData(form_add_exp);
        fetch('/addtransaction', {
            method  :   'POST',
            body    :   formdata
            }
        )
        .then(res=>{ 
            if (res.ok){
                form_add_exp_result_alert.classList.replace('alert-danger','alert-success');
                form_add_exp_result_alert.querySelector('span').innerText = "Expense is added successfully!"
                document.querySelector('#add-exp-result-alert').style.display = 'block';
                form_add_exp.reset();
                return;
            } 
            form_add_exp_result_alert.classList.replace('alert-success','alert-danger');
            form_add_exp_result_alert.querySelector('span').innerText = "Expense is NOT added! Please retry."
            document.querySelector('#add-exp-result-alert').style.display = 'block';
        })
        .catch(e=>{console.log(e)})

    });
});

const sample_json = "";
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
}


const form_show_exp = document.querySelector('section#show_expense > form');
const resetButton = form_show_exp.querySelector('button[type="reset"]');
form_show_exp.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formdata = new FormData(form_show_exp);
    const queryParams = new URLSearchParams();
    for (const [key, value] of formdata.entries()) {
        if (key === 'dateField') {
            const formattedDate = formatDate(value);
            queryParams.append(key, formattedDate);
        } else {
            queryParams.append(key, value);
        }
    }
    const queryString = new URLSearchParams(formdata).toString()
    fetch('/transactionsummary?'+queryString, { method:'GET' })
    .then(res=>{ 
        const span_summary = document.querySelectorAll('div#exp-summary-text > span');
        const div_summary = document.querySelector('div#exp-summary-text');
        document.querySelector('div#exp-summary-text').innerHTML= span_summary[0].outerHTML;
        if (!res.ok){
            document.querySelector('div#exp-summary-text > span').innerText = "Something went wrong in fetching the expense(s)! Please retry."
            div_summary.innerHTML = "<span class='col'>Something went wrong in fetching the expense(s)! Please retry.</span>";
            return;
        } 
        return res.json();
    })
    .then(data=>{
        const span_summary = document.querySelectorAll('div#exp-summary-text > span')[0];
        const div_summary = document.querySelector('div#exp-summary-text');
        div_summary.innerHTML = "";
        span_summary.innerHTML = "<strong class='col'>Net Savings ($):  </strong>" + data.Summary["Net Savings"];
        div_summary.innerHTML = span_summary.outerHTML;
        span_summary.innerHTML = "<strong class='col'>Total Expense ($):  </strong>" + data.Summary["Total Expense"];
        div_summary.innerHTML += span_summary.outerHTML;
        span_summary.innerHTML = "<strong class='col'>Total Income ($):  </strong>" + data.Summary["Total Income"];
        div_summary.innerHTML += span_summary.outerHTML;
        

        const table_body = document.querySelector('section#show_expense > table > tbody');
        table_body.innerHTML = "";
        data.transactions.forEach(transaction => {
            const row = table_body.insertRow();
            row.insertCell(0).innerText = transaction.date;
            row.insertCell(1).innerText = transaction.category;
            row.insertCell(2).innerText = transaction.description;
            row.insertCell(3).innerText = transaction.amount;
        });
        

            // const date = row.insertCell(0);
            // const category = row.insertCell(1);
            // const desc = row.insertCell(2);
            // const amount = row.insertCell(3);
            // date.innerText = transaction.date;
            // category.innerText = transaction.category;
            // desc.innerText = transaction.description;
            // amount.innerText = transaction.amount;
        
        const chart_data = document.querySelector('div#exp-summary-chart');
        chart_data.setAttribute('data1', JSON.stringify(data.income_plot_data));
        chart_data.setAttribute('data2', JSON.stringify(data.expense_plot_data));
        document.querySelector('script-py').innerHTML = ""; //To clear any residual charts
        document.querySelector('#chart_trigger').click();
    })
    .catch(e=>{
        const div_summary = document.querySelector('div#exp-summary-text');
        div_summary.innerHTML = "<span class='col'>Something went wrong in fetching the expense(s)! " + e + "</span>";
        console.log(e);

        // const span_summary = document.querySelectorAll('div#exp-summary > span');
        // document.querySelector('div#exp-summary-text').innerHTML= "<span class='col'>" + span_summary[0].innerHTML + "</span>";
        // document.querySelector('div#exp-summary-text > span').innerText = "Something went wrong in fetching the expense(s)! " + e
        // console.log(e)})  
        });
    resetButton.addEventListener('click', () => {
            form_show_exp.reset();
            console.log('Form has been reset.');
            const div_summary = document.querySelector('div#exp-summary-text');
            div_summary.innerHTML = '<span class="mb-2 row" style="text-align:left">Select Date Range to see summary of expenses</span>';
            const table_body = document.querySelector('section#show_expense > table > tbody');
            table_body.innerHTML = "";
            const chart_data = document.querySelector('div#exp-summary-chart');
            chart_data.setAttribute('data1', '[]');
            chart_data.setAttribute('data2', '[]');
            document.querySelector('script-py').innerHTML = "";
            console.log('Form and UI have been reset.');
    });
});
    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${month}-${day}-${year}`;}

