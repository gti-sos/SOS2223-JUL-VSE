<head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
</head>

<script>
  import { onMount } from 'svelte';
  import Highcharts from 'highcharts';
    import { redirect } from '@sveltejs/kit';

  // @ts-ignore
  let datos_vse = [];
  let chart;
  let API = 'https://sos2223-jul-vse.appspot.com/api/v1/agroprices-weekly/';

  onMount(async () => {
    await load_data();
    draw_chart();
  });

  async function load_data() {
    try {
      const res = await fetch(API, { method: 'GET' });
      const data = await res.json();
      datos_vse = data;
    } catch (error) {
      console.log(`Error al cargar los datos: ${error}`);
    }
  }

  function draw_chart() {
    // @ts-ignore
    const seriesData = datos_vse.map(({ year, price, week}) =>
      [year, price, week]
    );

    const chartOptions = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Gráfica de area | Highcharts'
      },
      xAxis: {
        title: {
          text: 'Año'
        }
      },
      yAxis: {
        title: {
          text: 'Valor'
        }
      },
      series: [{
        name: 'Precio respecto a los años',
        data: seriesData.map(([year, price]) => [year, price])
      }, {
        name: 'Precio respecto a las semanas',
        data: seriesData.map(([week, , price]) => [week, price])
      }]
    };

    // @ts-ignore
    chart = Highcharts.chart('chart-container', chartOptions);
  }
</script>

<main>
  <div id="chart-container"></div>
</main>
