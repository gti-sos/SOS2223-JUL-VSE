<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Button,
        Table,
        Alert, Col, Row
    } from "sveltestrap";    
    import { page } from "$app/stores";


    onMount(async () => {
        getProduct();
    });

    let market = $page.params.market;
    let year = $page.params.year;
    let week = $page.params.week;



    let API = '/api/v1/agroprices-weekly' + "/" + market + '/' + year + '/' + week;
    if(dev) API = 'http://localhost:12345' + API;


    let newmarket, newYear, newproduct, newtype, newweek, newclass, newunit, newcommpos, newprice;
    newmarket= market;
    newYear= year;
    newweek = week; 
    newproduct= newtype= newclass= newunit= newcommpos= newprice = "";



    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";
    async function getProduct() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            newmarket = data.market;
            newYear = data.year;
            newproduct = data.product;
            newtype = data.type;
            newweek = data.week;
            newclass = data.class;
            newunit = data.unit;
            newcommpos = data.commpos;
            newprice = data.price;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if(status == 404){
            message = `No existe ningun producto en la semana ${newweek} para el mercado: ${newmarket}, en el año: ${newYear}.`;
            color_alert = "danger";
        }else{
            if(status == 400){
                message = "Ha habido un error en la petición";
                color_alert = "danger";
            }
        }
    }
    function volverAtras (){
        return history.back()
    }
    async function PutProvision() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                market: newmarket,
                year:newYear,
                product: newproduct,
                type: newtype,
                week: newweek,
                class: newclass,
                unit: newunit,
                commpos: newcommpos,
                price: newprice,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso actualizado correctamente";
            color_alert = "success";
            open = false;
            getProduct();
        }else{
            if(status == 404){
            message = `No hay ningún recurso para este mercado y este año.`;
            color_alert = "danger";
            }else{
                if(status == 400){
                    message = "Ha ocurrido un fallo en la aplicacion";
                    color_alert = "danger";
                }else{
                    if(status == 409){
                        message = "El mercado debe estar dentro de Andalucia";
                        color_alert = "danger";
                    }
                }
            }
        }
    }
        
</script>


<div class="cabecera">

    <Row> 
        {#if message != ""}
        <Alert fade={true} color={color_alert} dismissible>{message}</Alert>
    {/if}
</Row>
    
</div>
<div  class = "wp">
    <Table responsive>
        <thead>
            <tr>
                <th>Mercado</th>
                <th>Año</th>
                <th>Semana</th>
                <th>Clase</th>
                <th>Unidad</th>
                <th>Posición comercial</th>
                <th>Precio</th>
                <th>Producto</th>
                <th>Tipo</th>
            </tr>
        </thead>
        <tbody>
            <tr>

                <td style="color: #9D69FD;">{market}</td>
                <td style="color: #9D69FD;">{year}  </td>
                <td style="color: #9D69FD;">{week}  </td>
                <td><input bind:value={newproduct} style="color: #9D69FD;" /></td>
                <td><input bind:value={newtype} style="color: #9D69FD;" /></td>
                <td><input bind:value={newclass} style="color: #9D69FD;" /></td>
                <td><input bind:value={newunit} style="color: #9D69FD;" /></td>
                <td><input bind:value={newcommpos} style="color: #9D69FD;" /></td>
                <td><input bind:value={newprice} style="color: #9D69FD;" /></td>
                <td><Button color="primary" on:click={PutProvision}>Actualizar</Button></td>
            </tr>
        </tbody>

        
    </Table>

    <Button color="secondary" on:click={volverAtras} >Volver Atras</Button>

</div>