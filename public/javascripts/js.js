$.get("/positions", function (response) {
    $.each(response.positions.values, function (i, el) {
        console.log(el.company.name, el.title);
    });
});