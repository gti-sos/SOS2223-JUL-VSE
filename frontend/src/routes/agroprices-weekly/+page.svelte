<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import {Pagination,PaginationItem,PaginationLink} from "sveltestrap";
  import { dev } from "$app/environment";
  import {
    Button,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    Alert,
    FormGroup,
    Form,
    Input,
  } from "sveltestrap";

  let API = "/api/v1/agroprices-weekly";

  if (dev) API = "http://localhost:12345" + API;

  onMount(async () => {

    getProducts();
  });
  function volverAtras() {
    return history.back();
  }

  let open = false;
  const toggle = () => (open = !open);
  const toggleC = () => (showcreateform = !showcreateform);
  const toggleS = () => (showsearchform = !showsearchform);

  let result = "";
  let resultStatus = "";
  let search = [];
  let showM, color,message ="";
  let showcreateform = false;
  let showsearchform = false;
  let loaded = false;

  function showMessage(mensaje, colorM) {
    showM = true;
    color = colorM;
    message = mensaje;
   
    setTimeout(() => {
      showM = false;
    }, 3000);
  }


  // --------------------------------------Pagination --------------------------------------------

  function getTotalPages() {
return Math.ceil(products.length / itemsPerPage);
}


function goToPage(page) {
currentPage = page;
let url = API; 
console.log()
if(currentPage > getTotalPages) {
  showMessage('Es la última página', "warning");
  goToPage(getTotalPages());
}
else if(search.length !== 0 && currentPage<=getTotalPages() ){
  const offset = (currentPage - 1) * itemsPerPage;
  url += `?offset=${offset}&limit=${itemsPerPage}`;

fetch(url)
  .then(response => response)
  .then(data => {
    search = data;
  })
  .catch(error => {
    console.error('Error fetching agroprices-weekly:', error);
  })

}
}



let currentPage = 1;
const itemsPerPage = 10;

const pageSize = 10;
  

  let datos = "";
  let products = [];

  async function loadproducts() {
    resultStatus = 0;
    result = "";
    const res = await fetch(API + "/loadInitialData", {
      method: "GET",
    });
    loaded = true;

    const status = await res.status;
    resultStatus = status;
    if (status === 201) {
      datos = true;
      getProducts();
      showMessage("Datos cargados correctamente", "success");
    }else if(status === 200) {
      datos = true;
      getProducts();
    }
    else{
      datos = false;
      showMessage("Error al cargar los datos", "error")
    }


    try {
      products = await res.json();
      search = products;
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
      
    }
  }

  // Define el objeto de búsqueda
  let query = {
    market: "",
    year: "",
    product: "",
    class: "",
    week: "",
    week_over: "",
    week_below: "",
    price: "",
    price_over: "",
    price_below: "",
    type: "",
    commpos: "",
    unit: "",
    from: "",
    to: ""
  };

  // Función para obtener las products según el objeto de búsqueda y los parámetros de paginación
async function getProducts() {
  showsearchform = false;
  // Construye la URL para hacer la petición GET al backend
  let url = API;
  let params = '';

  // Agrega los parámetros de búsqueda a la URL, si existen
  if (query.from) {
    params += `&from=${query.from}`;
  }
  if (query.to) {
    params += `&to=${query.to}`;
  }
  if (query.market) {
    params += `&market=${query.market}`;
  }
  if (query.year) {
    params += `&year=${query.year}`;
  }
  if (query.product) {
    params += `&product=${query.product}`;
  }
  if (query.class) {
    params += `&class=${query.class}`;
  }
  if (query.week) {
    params += `&week=${query.week}`;
  }
  if (query.week_over) {
    params += `&week_over=${query.week_over}`;
  }
  if (query.week_below) {
    params += `&week_below=${query.week_below}`;
  }
  if (query.price) {
    params += `&price=${query.price}`;
  }
  if (query.price_over) {
    params += `&price_over=${query.price_over}`;
  }
  if (query.price_below) {
    params += `&price_below=${query.price_below}`;
  }
  if (query.type) {
    params += `&type=${query.type}`;
  }
  if (query.commpos) {
    params += `&commpos=${query.commpos}`;
  }
  if (query.unit) {
    params += `&unit=${query.unit}`;
  }


  if(!loaded & !showPost) loadproducts();
  
  // Agrega los parámetros de búsqueda a la URL solo si ya existe algún parámetro en ella
  if (params) {
      url += `?${params.substring(1)}`;
    }

    // Realiza la petición GET al backend
    const res = await fetch(url, {
      method: 'GET',
    });

    try {
      const data = await res.json();
      products = data;
      search = products;


    } catch (error) {
      datos = false;
      console.log(`Error parsing result: ${error}`);
      showMessage('Error al cargar los datos','error');
    }

    const status = await res.status;
    resultStatus = status;
    if (resultStatus === 200) {
      datos = true;
      if(params) showMessage("Datos encontrados", "success");
    }
    else{
      datos = false;
      showMessage("No se han encontrado los datos", "danger");

    }
  }
 



  let newproduct = {
    market: "",
    year: "",
    product: "",
    class: "",
    week: "",
    price: "",
    type: "",
    commpos: "",
    unit: "",
  };

  let showPost = "";


  async function createProvitions() {
    resultStatus = result = "";
    let market1 = newproduct.market;
    let year1 = Number(newproduct.year);
    let week1 = Number(newproduct.week);
    let price1 = Number(newproduct.price);
    let commpos1 = newproduct.commpos;
    let product1 = newproduct.product;
    let class1 = newproduct.class;
    let type1 = newproduct.type;
    let unit1 = newproduct.unit;

    console.log(newproduct);

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        market: market1,
        year: year1,
        product: product1,
        class: class1,
        week: week1,
        price: price1,
        type: type1,
        commpos: commpos1,
        unit: unit1
      }),
    });
    const status = await res.status;
    resultStatus = status;
    if (status == 201) {
      showMessage("Recurso creado correctamente", "success");
      products.push(JSON.stringify({
        market: market1,
        year: year1,
        product: product1,
        class: class1,
        week: week1,
        price: price1,
        type: type1,
        commpos: commpos1,
        unit: unit1
      }));
      showcreateform = false;
      showPost = true;
      getProducts();
      newproduct = [];

    } else {
      if (status == 400) {
        showMessage(`Hay que insertar datos o hay campos vacios (${status})`, "danger");
      } else {
        if (status == 409) {
          showMessage(`El recurso ya existe o la Mercado no existe(${status})`, "danger");
        }
      }
    }
  }

  async function deleteproducts() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: "DELETE",
    });
    const status = await res.status;
    resultStatus = status;
    open = false;
    if (status == 200) {
      open = false;
      datos = "";
      getProducts();
      showMessage("Recursos borrados correctamente", "success");
    }
  }

  async function deleteProduct(market, year, week) {
    resultStatus = result = "";
    const res = await fetch(
      API + "/" + market + "/" + year + "/" + week,
      {
        method: "DELETE",
      }
    );
    const status = await res.status;
    resultStatus = status;
    if (status == 200) {
      getProducts();
      showMessage("Recurso borrado correctamente", "success");
    }
  }
</script>
<body>
  
<h1>Productos</h1>
<h2>Desarrollado por Víctor Manuel Sánchez Espada</h2>


  {#if message!=""}
  <Alert color={color} isOpen={showM}>
    {message}
  </Alert>
  {/if}


<div class="d-flex justify-content-center">
    <Row>
      <Col sm = "4">
        <Button outline color ="secondary" style="width: 200px;" on:click={loadproducts}>Cargar Productos</Button
        ></Col>
      <Col sm = "4">
        <Button color="success" style="width: 200px;" on:click={toggleC}>Crear un Producto</Button>
      </Col>
      <Col sm = "4"
        ><Button color="danger" style="width: 200px;" on:click={toggle}>Borrar recursos</Button></Col
      >

    </Row>

    <Modal  isOpen={open} {toggle}>
      <ModalHeader >Procede a borrar todos los datos</ModalHeader>
      <ModalBody>¿Estás seguro?</ModalBody>
      <ModalFooter>
        <Button color="secondary" on:click={deleteproducts}>Confirmar</Button>
        <Button color="secondary" on:click={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
</div>

<div class="tablas">


  <Row>
    <Col class="d-flex justify-content-center">
      <Button style="width: 200px; margin-top: 10px;" color="success" on:click={() => toggleS()}>Filtrar Datos</Button>
    </Col>
  </Row>


  <Table class="tabla" responsive>
    <thead>
      <tr>
        <th>Mercado</th>
        <th>Año</th>
        <th>Producto</th>
        <th>Clase</th>
        <th>Semana</th>
        <th>Precio</th>
        <th>Tipo</th>
        <th>Posición comercial</th>
        <th>Unidad</th>
      </tr>
    </thead>
    <tbody>
            

      {#if datos}
      {#each products.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage) as product}
        <tr>
          <td>{product.market}</td>
          <td>{product.year}</td>
          <td>{product.product}</td>
          <td>{product.class}</td>
          <td>{product.week}</td>
          <td>{product.price}</td>
          <td>{product.type}</td>
          <td>{product.commpos}</td>
          <td>{product.unit}</td>
          <td
            ><Button
              color="danger"
              on:click={() =>
                deleteProduct(
                  product.market,
                  product.year,
                  product.week
                )}>Borrar</Button
            >
          </td>
          <td
            ><Button color="info" on:click
              ><a
                href="agroprices-weekly/{product.market}/{product.year}/{product.week}"
                >Editar</a
              ></Button
            >
          </td>
        </tr>
        
        
      {/each}
      {/if}

      
      
    </tbody>
  </Table>
  {#if datos}
  <Pagination class="d-flex justify-content-center" size="lg" ariaLabel="Page navigation example">
    <PaginationItem disabled={currentPage === 1}>
      <PaginationLink first on:click={() => goToPage(1)} href="#" />
    </PaginationItem>
    <PaginationItem disabled={currentPage === 1}>
      <PaginationLink previous on:click={() => goToPage(currentPage-1)} href="#" />
    </PaginationItem>
    <PaginationItem active>
      <PaginationLink on:click={() => goToPage(currentPage)} href="#">{currentPage}</PaginationLink>
    </PaginationItem>
    <PaginationItem disabled={currentPage === Math.ceil(products.length/itemsPerPage)}>
      <PaginationLink next on:click={() => goToPage(currentPage+1)} href="#" />
    </PaginationItem>
    <PaginationItem disabled={currentPage === Math.ceil(products.length/itemsPerPage)}>
      <PaginationLink last on:click={() => goToPage(Math.ceil(products.length/itemsPerPage))} href="#" />
    </PaginationItem>
  </Pagination>
{/if}

</div>
<Row>
  <Col sm = "4"
><Button color="info" style="width: 200px; margin-bottom: 30px;" on:click={volverAtras}>Volver Atras</Button>
</Col>
</Row>

<Modal  isOpen={showsearchform} {toggleS}>
  <ModalHeader class="d-flex justify-content-center">Filtrar Datos</ModalHeader>
  <div>
    <button class="close-button" on:click={toggleS}>
      <svg class="close-icon" viewBox="0 0 24 24">
        <path d="M12 10.586L16.95 5.636c.363-.362.964-.362 1.326 0 .363.363.363.964 0 1.326L13.325 12l4.95 4.95c.363.363.363.964 0 1.326-.181.181-.416.272-.652.272-.236 0-.472-.09-.652-.272L12 13.675l-4.95 4.95c-.18.181-.416.272-.652.272-.236 0-.472-.09-.652-.272-.363-.362-.363-.964 0-1.326L10.675 12 5.725 7.05c-.363-.362-.363-.964 0-1.326.362-.363.964-.363 1.326 0L12 10.586z"/>
      </svg>
    </button>
  </div>
  <ModalBody>

    <Form>
      <h4>Filtro por Periodo de Años</h4>
      <FormGroup floating label="Desde el Año">
        <Input bind:value={query.from}/>
      </FormGroup>
      <FormGroup floating label="Hasta el Año">
        <Input bind:value={query.to}/>
      </FormGroup>
      <h4>Búsquedas Númericas</h4>
      <FormGroup floating label="Semana Mayor">
        <Input bind:value={query.week_over}/>
      </FormGroup>
      <FormGroup floating label="Semana Menor">
        <Input bind:value={query.week_below}/>
      </FormGroup>
      <FormGroup floating label="Precio Mayor">
        <Input bind:value={query.price_over}/>
      </FormGroup>
      <FormGroup floating label="Precio Menor">
        <Input bind:value={query.price_below}/>
      </FormGroup>
      <h4>Filtro por Propiedades</h4>
      <FormGroup floating label="Mercado">
        <Input bind:value={query.market}/>
      </FormGroup>
      <FormGroup floating label="Año">
        <Input bind:value={query.year}/>
      </FormGroup>
      <FormGroup floating label="Producto">
        <Input bind:value={query.product}/>
      </FormGroup>
      <FormGroup floating label="Clase">
        <Input bind:value={query.class}/>
      </FormGroup>
      <FormGroup floating label="Semana">
        <Input bind:value={query.week}      />
      </FormGroup>
      <FormGroup floating label="Precio">
        <Input bind:value={query.price}/>
      </FormGroup>
      <FormGroup floating label="Tipo">
        <Input
        bind:value={query.type}/>
      </FormGroup>
      <FormGroup floating label="Posición comercial">
        <Input bind:value={query.commpos}/>
      </FormGroup>
      <FormGroup floating label="Unidad">
        <Input bind:value={query.unit}/>
      </FormGroup>
      
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="success" on:click={getProducts}>Buscar</Button>
    <Button color="secondary" on:click={toggleS}>Cancelar</Button>
  </ModalFooter>
</Modal>

<Modal  isOpen={showcreateform} {toggleC}>
  <ModalHeader >Crear una provisión</ModalHeader>
  <div>
    <button class="close-button" on:click={toggleC}>
      <svg class="close-icon" viewBox="0 0 24 24">
        <path d="M12 10.586L16.95 5.636c.363-.362.964-.362 1.326 0 .363.363.363.964 0 1.326L13.325 12l4.95 4.95c.363.363.363.964 0 1.326-.181.181-.416.272-.652.272-.236 0-.472-.09-.652-.272L12 13.675l-4.95 4.95c-.18.181-.416.272-.652.272-.236 0-.472-.09-.652-.272-.363-.362-.363-.964 0-1.326L10.675 12 5.725 7.05c-.363-.362-.363-.964 0-1.326.362-.363.964-.363 1.326 0L12 10.586z"/>
      </svg>
    </button>
  </div>
  <ModalBody>
    <Form>
      <FormGroup floating label="Mercado">
        <Input bind:value={newproduct.market}/>
      </FormGroup>
      <FormGroup floating label="Año">
        <Input bind:value={newproduct.year}/>
      </FormGroup>
      <FormGroup floating label="Producto">
        <Input bind:value={newproduct.product}/>
      </FormGroup>
      <FormGroup floating label="Clase">
        <Input bind:value={newproduct.class}/>
      </FormGroup>
      <FormGroup floating label="Semana">
        <Input bind:value={newproduct.week}      />
      </FormGroup>
      <FormGroup floating label="Precio">
        <Input bind:value={newproduct.price}/>
      </FormGroup>
      <FormGroup floating label="Tipo">
        <Input
        bind:value={newproduct.type}/>
      </FormGroup>
      <FormGroup floating label="Posición comercial">
        <Input bind:value={newproduct.commpos}/>
      </FormGroup>
      <FormGroup floating label="Unidad">
        <Input bind:value={newproduct.unit}/>
      </FormGroup>
      
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="success" on:click={createProvitions}>Confirmar</Button>
    <Button color="secondary" on:click={toggleC}>Cancelar</Button>
  </ModalFooter>
</Modal>




</body>

<style>
  /* estilos generales */

  
  body {
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    color: #333;
    margin: 0;
    padding: 0;
  }

  /* estilos para la tabla */
  .tablas {
    padding: 20px;
    background-color: #f5f5f5;
  }

  


  th,td {
    padding: 0.75rem;
    vertical-align: middle;
    text-align: center;
    border-top: 1px solid #dee2e6;
  }

  th {
    font-weight: bold;
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
  }

  



  h1 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  h2 {
    text-align: center;
    margin-bottom: 50px;
  }


  .tablas {
    margin-bottom: 50px;
  }
  th {
    text-align: center;
  }
  td {
    vertical-align: middle !important;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .close-icon {
    width: 24px;
    height: 24px;
    fill: #000;
  }

</style>
