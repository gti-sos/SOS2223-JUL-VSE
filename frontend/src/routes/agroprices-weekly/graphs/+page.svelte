<svelte:head>

  <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-3d.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  let API = '/api/v1/agroprices-weekly';
  if (dev) API = 'http://localhost:12345' + API;

  let data = [];
  let result = "";
  let resultStatus = "";
  onMount(async () => {
    await getData();
    await getData2();
  });

  async function getData() {
    resultStatus = result = "";
    try {
      const res = await fetch(API + "/data", {
        method: 'GET'
      });
      const dataReceived = await res.json();
      result = JSON.stringify(dataReceived, null, 2);
      data = dataReceived;
      const status = await res.status;
      resultStatus = status;
      loadCharts(data);
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }

  }

  var mercados = [];
  var numero_mercados = [];

  async function getData2(){

    resultStatus = result = "";
    const res = await fetch(API, {
        method: "GET"
    });
    if(res.ok){
        try{
            const products = await res.json();

            const dic = products.reduce((res, actual) => { //Agrupar por provincia
                const prod = actual.market;
                res[prod] = res[prod] || [];
                res[prod].push(actual);
                return res;
            }, {} ); // inicializar el res
            
            const groupedArray = Object.keys(dic).map(key => dic[key]);
            const mercadoLengths = {};
            let totalproducts = 0;

            groupedArray.forEach(p =>{ //agrupar por provincia: numero de  provisiones 
                mercados.push(p[0]["market"]);
                const numproducts = p.length;
                numero_mercados.push(numproducts);
                mercadoLengths[p[0]["market"]] = numproducts;
                totalproducts += numproducts;
            });
            let percentage = {};
            Object.keys(mercadoLengths).forEach(prod => { // cambiar el numero de provisiones por su porcentage
              percentage[prod] = (mercadoLengths[prod] / totalproducts) * 100;
            });
            const chartData = Object.entries(percentage).map(([market, porcentage]) => ({
              name: market,
              y: Number(porcentage.toFixed(2)),
            }));
            
      loadCharts2(chartData); 
      }catch(error){
            console.log(`Error devolviendo la gráfica: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }else{
        console.log("Error al cargar la gráfica");
    }
    }

  async function loadCharts(graphData) {
    const chartData = graphData.map(({market, products_number }) => ({
      y: products_number,
      label: market
    }));

    const chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Productos en Andalucía"
      },
      axisY: {
        title: "Número de productos"
      },
      data: [{
        type: "column",
        showInLegend: true,
        legendMarkerColor: "grey",
        legendText: "Productos por mercado",
        dataPoints: chartData
      }]
    });
    chart.render();
  }

  async function loadCharts2(graphData){

    // Create the chart
    Highcharts.chart('container', {
      chart: {
          type: 'pie'
      },
      title: {
          text: 'Productos',
          align: 'left'
      },
      subtitle: {
          text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
          align: 'left'
      },

      accessibility: {
          announceNewData: {
              enabled: true
          },
          point: {
              valueSuffix: '%'
          }
      },

      plotOptions: {
          series: {
              borderRadius: 5,
              dataLabels: {
                  enabled: true,
                  format: '{point.name}: {point.y:.1f}%'
              }
          }
      },

      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },

      series: [
          {
              name: 'Mercados',
              colorByPoint: true,
              data: graphData
          }
      ]

      
    });

  }


</script>

<main>
  
  <h1 style="margin-top: 30px;">Grafo 1: Número de Productos en cada mercado</h1>
  <div id="chartContainer" style="height: 300px; width: 100%;"></div>


  <h1 style="margin-top: 30px;">Grafo 2: Porcentaje de productos de cada mercado</h1>
    <figure class="highcharts-figure">
      <div id="container"></div>
  
</figure>
</main>

<style>



  #container {
    height: 400px;
}

.highcharts-figure {
    min-width: 310px;
    max-width: 800px;
    margin: 1em auto;
}


</style>