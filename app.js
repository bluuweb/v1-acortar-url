$(() => {
    const formulario = $("#formulario");
    const inputTexto = $("#inputTexto");
    const spinner = $("#spinner");
    const resultadoEnlaces = $("#resultadoEnlaces");

    let arrayEnlaces = [];

    const pintarEnlaces = () => {
        console.log(arrayEnlaces);
        resultadoEnlaces.html("");
        arrayEnlaces.forEach((item) => {
            resultadoEnlaces.append(`
            <article class="card mb-2">
                <div class="card-body">
                    <p>Enlace original: ${item.original_link}</p>
                    <a href="${item.full_short_link}">${item.full_short_link}</a>
                </div>
            </article>
            `);
        });
    };

    // leer localstorage
    if (localStorage.getItem("urls")) {
        arrayEnlaces = JSON.parse(localStorage.getItem("urls"));
        pintarEnlaces();
    }

    formulario.on("submit", (e) => {
        e.preventDefault();
        // console.log("procesando formulario...");
        // console.log(inputTexto.val());

        $.ajax({
            url: `https://api.shrtco.de/v2/shorten?url=${inputTexto.val()}`,
            type: "GET",
            dataType: "JSON",
            beforeSend() {
                spinner.removeClass("d-none");
            },
            success(data) {
                console.log(data);
                if (data.ok) {
                    const objetoEnlace = {
                        full_short_link: data.result.full_short_link,
                        original_link: data.result.original_link,
                        code: data.result.code,
                    };
                    arrayEnlaces.push(objetoEnlace);
                    localStorage.setItem("urls", JSON.stringify(arrayEnlaces));
                    pintarEnlaces();
                }
            },
            error(e) {
                console.log(e);
            },
            complete() {
                spinner.addClass("d-none");
            },
        });
    });
});
