document.getElementById('btnSend').addEventListener('click', () => {
    let query = document.getElementById('query');

    if (query) {
        // process query

        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: "{ forecasts { cc } }"
            })
        })
        .then(r => r.json())
        .then(data => console.log('data returned:', data));


    } else {
        alert('Enter a query.');
    }
});