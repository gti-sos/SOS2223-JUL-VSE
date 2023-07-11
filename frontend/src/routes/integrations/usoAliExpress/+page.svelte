<svelte:head>
    <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<!-- <script>
//@ts-nocheck

  import { onMount } from "svelte";
  import { dev } from "$app/environment";

  let datos = "";

  onMount(async () => {
    await getData();
  });

  let API = "/api/v1";
  if (dev) API = "http://localhost:12345" + API;

  async function getData() {
    const res = await fetch(API + "/uso_sales");

    try {
      const datos = await res.json();
      const status = await res.status;

      const resultList = datos.result.resultList;
      let chartData = [];

      resultList.forEach((item) => {
        const itemId = item.item.title.split(' ').slice(0, 4).join(' ');
        const sales = parseInt(item.item.sales); // Convertir a número
        let obj = {
          y: sales,
          label: itemId,
        };

        chartData.push(obj);
      });

      loadData(chartData);
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  }

  function loadData(chartData) {
    const chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Venatas de Mi tienda",
        horizontalAlign: "left",
      },
      data: [
        {
          type: "doughnut",
          startAngle: 60,
          indexLabelFontSize: 17,
          indexLabel: "{label} - #percent%",
          toolTipContent: "<b>{label}:</b> {y} (#percent%)",
          dataPoints: chartData,
        },
      ],
    });
    chart.render();
  }
</script> -->

<script>
  import { onMount } from 'svelte';

  let quote = '';
  let character = '';
  let image = '';

  async function getRandomQuote() {
    const response = await fetch('https://thesimpsonsquoteapi.glitch.me/quotes?lang=es');
    const data = await response.json();

    // Extraer la cita, el personaje y la imagen de los datos obtenidos
    quote = data[0].quote;
    character = data[0].character;
    image = data[0].image;
  }

  onMount(getRandomQuote);
</script>

<main>
  <h1>¡Cita de Los Simpson!</h1>
  <button class="btn btn-primary" on:click={getRandomQuote}>Obtener nueva cita</button>
  {#if quote && character && image}
    <p>"{quote}" - {character}</p>
    <img src={image} alt={character} />
  {:else}
    <p>Cargando...</p>
  {/if}
</main>
<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }

</style>

<body style="height: 65vh; padding: 20px;">
  
  <div id="chartContainer" style="height: 300px; width: 100%;"></div>
</body>
