import Datastore from 'nedb';
import axios from 'axios';
import request from 'request';
var db = new Datastore();

function vse (app){
    const BASE_API_URL = "/api/v1";
    const rutavse = "/api/v1/agroprices-weekly";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/26059751/2s93zH2KLL";

    //POSTMAN docs
    app.get(rutavse+"/docs",(req,res)=>{
      res.redirect(API_DOC_PORTAL);
    });
  
    var paths = "/api/proxyvse"
    var apiServerHost = "https://sos2223-17.appspot.com/api/v2/andalusian-bicycle-plans"
    app.use(paths, function(req, res) {
        var url = apiServerHost + req.url;
        console.log('piped: ' + req.url);
        req.pipe(request(url)).pipe(res);
       });
      


    // USOS
  
        //uso Amazon
        app.get('/api/v1/amazondata', async (req, res) => {
            const options = {
                method: 'GET',
                url: 'https://amazon-web-scraping-api.p.rapidapi.com/products/search',
                params: {
                  criteria: 'AMD Ryzen',
                  page: '1',
                  countryCode: 'US',
                  languageCode: 'EN'
                },
                headers: {
                  'X-RapidAPI-Key': '621cb83b84msh28cec764879c509p1ee6bbjsn826efdd3023b',
                  'X-RapidAPI-Host': 'amazon-web-scraping-api.p.rapidapi.com'
                }
              };
              try {
                const response = await axios.request(options);
                res.json(response.data);
            } catch (error) {
                console.error(error);
            }
         });
    
    
    
    
        //uso homicidios
        app.get('/api/v1/homicide_rate', async (req, res) => {
     
            const options = {
                method: 'GET',
                url: 'https://world-cities-by-homicide-rate.p.rapidapi.com/2GI3px/_cities_by_homicide_rate',
                headers: {
                'X-RapidAPI-Key': 'b438c147e1mshf0cf7673386f32bp1a3702jsn4684b7b860b7',
                'X-RapidAPI-Host': 'world-cities-by-homicide-rate.p.rapidapi.com'
                }
            };
          
            try {
              const response = await axios(options);
              res.json(response.data);
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Error al obtener los datos' });
            }
          });
          
    
    
        //USO CURRENCY
        app.get('/api/v1/uso_currency', async (req, res) => {
            const options = {
                method: 'GET',
                url: 'https://currency23.p.rapidapi.com/currencyToAll',
                params: {
                  base: 'EUR',
                  int: '1'
                },
                headers: {
                  'X-RapidAPI-Key': 'b438c147e1mshf0cf7673386f32bp1a3702jsn4684b7b860b7',
                  'X-RapidAPI-Host': 'currency23.p.rapidapi.com'
                }
              };
    
            try {
                const response = await axios.request(options);
                res.json(response.data);
            } catch (error) {
                console.error(error);
            }
        });
    
        //USO ALIEXPRESS
        app.get('/api/v1/uso_sales', async (req, res) => {
            const options = {
                method: 'GET',
                url: 'https://aliexpress-datahub.p.rapidapi.com/item_search_promotion_deals',
                qs: { page: '1' },
                headers: {
                    'X-RapidAPI-Key': 'b270bea616msh4290fc927f6297bp15e5fajsnce54fefbd472',
                    'X-RapidAPI-Host': 'aliexpress-datahub.p.rapidapi.com'
                }
            };
    
            try {
                const response = await axios.request(options);
    
                res.json(response.data);
    
            } catch (error) {
                console.error(error);
            }
    
        });

    //Integración
    app.get(rutavse + "/data", async (req, res) => {

        console.log(`New GET to /data`);
        let mercados = ['AL-Almería', 'CA-Cádiz', 'CO-Córdoba', 'GR-Granada', 'HU-Huelva', 'JA-Jaén', 'MA-Málaga', 'SE-Sevilla'];

        var data = [];

        try {
            // Esperar a que todas las consultas a la base de datos se completen
            await Promise.all(mercados.map(mercado => {

                return new Promise((resolve, reject) => {
                    db.find({ market: mercado }).exec(function (err, docs) {
                        if (err) {
                            reject(err);
                        } else {
                            data.push({ market: mercado, products_number: docs.length });
                            resolve();
                        }
                    });
                });

            }));
            res.json(data);

        } catch (err) {
            // Manejar errores de consulta
            res.status(500).json(err);
        }
    });

  //loadInitialData
  app.get(rutavse + "/loadInitialData", (req, res) => {
    db.find({}, function (err, docs) {
      if (docs.length === 0) {
        db.insert([
          {product: "REFINADO",type: "Aceites de girasol",class: "S.E.",unit: "100 kg",market: "CO-Córdoba",commpos: "A.I.",price: 86.30,year: 2013, week: 52},
          {product: "REFINADO",type: "Aceites de girasol",class: "S.E.",unit: "100 kg",market: "CO-Córdoba",commpos: "A.I.",price: 78.53,year: 2013, week: 18},
          {product: "REFINADO",type: "Aceites de girasol",class: "S.E.",unit: "100 kg",market: "CO-Córdoba",commpos: "A.I.",price: 77.53,year: 2012, week: 32},
          {product: "DE ORUJO CRUDO",type: "ACEITES DE OLIVA",class: "5 g BAS. 10",unit: "100 kg",market: "CO-Córdoba",commpos: "A.I.",price: 79.50,year: 2014, week: 1},
          {product: "DE ORUJO REFINADO",type: "ACEITES DE OLIVA",class: "S.E.",unit: "100 kg",market: "CO-Córdoba",commpos: "A.I.",price: 118.69,year: 2013, week: 52},
          {product: "VÍRGENES-VIRGEN EXTRA",type: "ACEITES DE OLIVA",class: "S.E.",unit: "100 kg",market: "GR-Granada",commpos: "A.I.",price: 203.00,year: 2014, week: 1},
          {product: "BLANCA O COMÚN",type: "AVENA",class: "S.E.",unit: "t",market: "SE-Sevilla",commpos: "S.Alm.",price: 183.00,year: 2013, week: 52},
          {product: "CABALLAR",type: "CEBADA",class: "S.E.",unit: "t",market: "GR-Granada",commpos: "S.Alm.",price: 180.00,year: 2013, week: 52},
          {product: "CABALLAR",type: "CEBADA",class: "S.E.",unit: "t",market: "GR-Granada",commpos: "S.Alm.",price: 172.00,year: 2013, week: 27},
          {product: "CERVECERA",type: "CEBADA",class: "S.E.",unit: "t",market: "HU-Huelva",commpos: "S.Alm.",price: 195.00,year: 2016, week: 1},
          {product: "HENO",type: "ALFALFA",class: "S.E.",unit: "t",market: "CA-Cádiz",commpos: "Alm.",price: 190.00,year: 2014, week: 5},
          {product: "NACIONAL",type: "MAÍZ",class: "S.E.",unit: "t",market: "JA-Jaén",commpos: "E.A.I.",price: 180.00,year: 2014, week: 4},
          {product: "ICEBERG",type: "LECHUGA",class: "I",unit: "100 kg",market: "AL-Almería",commpos: "C.M.",price: 74.48,year: 2014, week: 13},
          {product: "ROMANA",type: "LECHUGA",class: "I",unit: "100 kg",market: "AL-Almería",commpos: "C.M.",price: 40.00,year: 2014, week: 13}, 
          {product: "CERVECERA",type: "CEBADA",class: "S.E.",unit: "t",market: "GR-Granada",commpos: "S.Alm.",price: 180.00,year: 2014, week: 1},
          {product: "FINO O MESERO",type: "LIMÓN",class: "I",unit: "100 kg",market: "MA-Málaga",commpos: "C.M.",price: 85.00,year: 2013, week: 52},
          {product: "CLEMENTINA MEDIA TEMPORADA-CLEMENULES",type: "MANDARINA",class: "S.E.",unit: "100 kg",market: "HU-Huelva",commpos: "Árbol",price: 30.00,year: 2014, week: 1},
          {product: "CLEMENTINA MEDIA TEMPORADA-CLEMENULES",type: "MANDARINA",class: "S.E.",unit: "100 kg",market: "MA-Málaga",commpos: "Árbol",price: 16.00,year: 2014, week: 1},
          {product: "CLEMENTINA MEDIA TEMPORADA-CLEMENULES",type: "MANDARINA",class: "S.E.",unit: "100 kg",market: "SE-Sevilla",commpos: "Árbol",price: 17.00,year: 2012, week: 16}
        ], function (err, newDocs) {
            res.status(201).json('Se han creado 10 datos');
            console.log("Se han creado 10 datos");
        });
      } else {
        res.status(200).json('Ya existen datos' );
        console.log("Ya existen datos");
      }
    });
    console.log("New GET to /agroprices-weekly/loadInitialData");
  });

  //GET producto + tipo
  app.get(rutavse + '/:product' + '/:type' , (req, res) => {
    const product = req.params.product;
    const type = req.params.type;
    
    db.find({ product: product, type: type}, (err, docs) => {
        if (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
        } else if (docs.length > 0) {
            if(docs.length == 1){
                res.json({...docs[0], _id: undefined})
            }
            else{
                res.status(200).json(docs.map((p) => {
                    delete p._id;
                    return(p);
                }));
            }
        console.log(`Nuevo GET a ${rutavse}/${product}/${type}`);
        } else {
        res.status(404).json({ message: `No existe ningún recurso para el producto: ${product} en el tipo: ${type} ` });
        }
    });
});

    //GET mercado + año + semana
    app.get(rutavse + '/:market' + '/:year' + '/:week', (req, res) => {
        const year = Number(req.params.year);
        const market = req.params.market;
        const week = Number(req.params.week);


        db.findOne({ market: market, year: year, week: week }, (err, docs) => {
            if (err) {
                res.status(500).json('Error interno del servidor');
            } else if (docs) {

                delete (docs._id);
                res.status(200).json(docs);

                console.log(`Nuevo GET a ${rutavse}/${market}/${year}/${week}`);
            } else {
                res.status(404).json(`No existe ningún recurso para la mercado: ${market} en el año: ${year} con el número de disposición: ${week}.`);
            }

        });
    });

        //GET periodo concreto + mercado
        app.get(rutavse + '/:market', (req, res) => {
            const market = req.params.market;
            const from = Number(req.query.from);
            const to = Number(req.query.to);
    
            // Filtrar por rango de años y por mercado en la base de datos
            db.find({ market: market, year: { $gte: from, $lte: to } }, function (err, docs) {
                if (from && to) {
                    if (from >= to) {
                        res.status(400).send("El rango es incorrecto");
                    } else {
                        if (docs.length !== 0) {
                            res.status(200).json(docs.map((p) => {
                                delete p._id;
                                return (p);
                            }));
                            console.log(`New GET to /agroprices-weekly/${market}?from=${from}&to=${to}`);
                        }
                        else {
                            res.status(404).json("No existe ningún recurso")
                        }
                    }
                } else {
                    // Filtrar solo por mercado en la base de datos
                    db.find({ market: market }, function (err, docs) {
                        if (docs.length !== 0) {
                            res.json(docs.map((p) => {
                                delete p._id;
                                return (p);
                            }));
                            console.log("New GET to /agroprices-weekly/" + market);
                        }
                        else {
                            res.status(404).json('No existe ningún recurso');
                        }
                    });
                }
            });
        });

      //GET BASE, Paginating, Search, from&to 2
      app.get(rutavse, (req, res) => {

        
        //paginating
        let offset = 0;
        let limit = 0;

        if (req.query.offset) {
            offset = Number(req.query.offset);
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }

        //Búsquedas
        let query = {};

        if (req.query.market) {
            query.market = req.query.market;
        }
        if (req.query.year) {
            query.year = Number(req.query.year);
        }
        if (req.query.product) {
            query.product = req.query.product;
        }
        if (req.query.class) {
            query.class = req.query.class;
        }
        if (req.query.week) {
            query.week = Number(req.query.week);
        }
        if (req.query.price) {
            query.price = Number(req.query.price);
        }
        if (req.query.commpos) {
            query.commpos = req.query.commpos;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.unit) {
            query.unit = req.query.unit;
        }

        //Búsquedas numéricas

        //week
        if (req.query.week_over) {
            query.week = { $gte: Number(req.query.week_over) };
        }
        if (req.query.week_below) {
            query.week = { $lte: Number(req.query.week_below) };
        }

        //year
        if (req.query.year_over) {
            query.year = { $gte: Number(req.query.year_over) };
        }
        if (req.query.year_below) {
            query.year = { $lte: Number(req.query.year_below) };
        }

        //price
        if (req.query.price_over) {
            query.price = { $gte: Number(req.query.price_over) };
        }
        if (req.query.price_below) {
            query.price = { $lte: Number(req.query.price_below) };
        }

        //GET and GET ?from&to and GET ?year
        const from = Number(req.query.from);
        const to = Number(req.query.to);
        const year = Number(req.query.year);


        if (from && to) {
            if (from >= to) {
                res.status(400).json("El rango es incorrecto");
            } else {
                query.year = { $gte: from, $lte: to };
            }
        } else if (year) {
            query.year = year;
        }

        db.find(query).sort({ year: req.body.year }).skip(offset).limit(limit).exec(function (err, docs) {
            if (err) {
                res.status(500).json(err);
            } else if (docs.length === 0) {
                res.status(404).json(`No existe ningún recurso.`);
            } else {
                res.status(200).json(docs.map((p) => {
                    delete p._id;
                    return (p);
                }));
            }
        });
    });

      // POST
      app.post(rutavse, (req, res) => {
        let newReq = req.body;
        console.log(newReq);
        if (!req.body || 
        !newReq.product || 
        !newReq.type || 
        !newReq.class || 
        !newReq.unit || 
        !newReq.market || 
        !newReq.commpos ||
        !newReq.price || 
        !newReq.year || 
        !newReq.week) {
            res.status(400).json({ message: 'Verifique que ha insertado todos los campos' });
        } else {
            const newData = req.body;
            db.find({
                product: newData.product,
                type: newData.type,
                class: newData.class,
                unit: newData.unit,
                market: newData.market,
                commpos: newData.commpos,
                price: Number(newData.price),
                year: Number(newData.year),
                week: Number(newData.week)
            }, (err, docs) => {
                if (docs.length > 0) {
                    res.status(409).json({ message: 'El recurso ya existe.' });
                } else {
                    db.insert(newData, (err, doc) => {
                        if (err) {
                            res.status(500).json(`Error interno del servidor: ${err}`);
                        } else {
                            console.log(`newData = ${JSON.stringify(doc, null, 2)}`);
                            console.log("New POST to /agroprocices-weekly");
                            res.status(201).json("El recurso se ha creado correctamente.");
                        }
                    });
                }
            });
        }
    });

  //Metodo Post de recurso(fallido) Victor
  //POST FALLIDO
  app.post(BASE_API_URL+"/agroprices-weekly/mercados/:market",(req,res)=>{
    res.status(405).json( "POST no está permitido en esta ruta."   );
    console.log("New post /agroprices-weekly/mercados/:market");
  });
  

      //PUT actualizar precio de un producto en un mercado
      app.put(rutavse + '/:market' + '/:product' + '/:year' + '/:week', (req, res) => {
        const market = req.params.market;
        const year = Number(req.params.year);
        const week = Number(req.params.week);
        const product = req.params.product;
        

        db.findOne({ market: market, product: product, year: year, week:week}, (err, existe) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!existe || 
                market !== req.body.market || 
                product !== req.body.product || 
                year !== Number(req.body.year) || 
                week !== Number(req.body.week)) {
                return res.status(400).send("Disposición incorrecta.");
            } else {
                existe.type = req.body.type || existe.type;
                existe.class = req.body.class || existe.class;
                existe.unit = req.body.unit || existe.unit;
                existe.commpos = req.body.commpos || existe.commpos;
                existe.price = Number(req.body.price) || existe.price;
                db.update({ _id: existe._id }, existe, {}, (err, numReplaced) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send("Disposición actualizada correctamente");
                    console.log("New PUT to /agroprices-weekly/" + market + "/" + product);
                });
            }
        });
    });

        //PUT actualizar disposicion
        app.put(rutavse + '/:market' + '/:year' + '/:week', (req, res) => {
            const market = req.params.market;
            const year = Number(req.params.year);
            const week = Number(req.params.week);
    
            db.findOne({ market: market, year: year, week: week }, (err, existe) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (!existe || market !== req.body.market || year !== Number(req.body.year) || week !== Number(req.body.week)) {
                    return res.status(400).json({ message: "Disposición incorrecta." });
                } else {
                    existe.product = req.body.product || existe.product;
                    existe.type = req.body.type || existe.type;
                    existe.unit = req.body.unit || existe.unit;
                    existe.commpos = req.body.commpos || existe.commpos;
                    existe.price = Number(req.body.price) || existe.price;
                    existe.class = req.body.class || existe.class;
                    db.update({ _id: existe._id }, existe, {}, (err, numReplaced) => {
                        if (err) {
                            return res.status(500).json(err);
                        }
                        res.status(200).json({ message: "Disposición actualizada correctamente" });
                        console.log("New PUT to /agroprices-weekly/" + market + "/" + year + "/" + week);
                    });
                }
            });
        });


  // Metodo PUT en URL base Victor(no se permite)
  app.put(BASE_API_URL + "/agroprices-weekly", (req, res) => {
    res.status(405).json({message: "PUT no está permitido en esta ruta."});
  });
  
  
  //Metodo Post en loadInitialData Bloqueado Victor
  app.get(BASE_API_URL + "/agroprices-weekly/loadInitialData", (req, res) => {
    res.status(405).send('En esta ruta no esta permitido el metodo POST');
  });

  //DELETE Todos los datos
  app.delete(rutavse, (req, res) => {
    db.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            res.status(500).json({message: "Ha ocurrido un error al eliminar los datos."});
        } else {
            res.status(200).json({message: "Los datos se han borrado correctamente."});
        }
    });
});


  //DELETE de un recurso.
  app.delete(rutavse + "/:product/:year/:week/:market", (req, res) => {
      const product = req.params.product;
      const year = Number(req.params.year);
      const week = Number(req.params.week);
      const market = req.params.market;
      
      db.remove({ product: product, year: year, week: week ,market: market }, {}, (err, numRemoved) => {
      if (err) {
        res.status(500).json({message: "Error interno del servidor."});
      } else if (numRemoved === 0) {
        res.status(404).json({message: "El recurso no existe."});
      } else {
        res.status(200).json({message: "El recurso se ha borrado correctamente."});
      }
      });
  });

  app.get('/api/v1/economy-stats', async (req, res) => {
    try {
      const url = 'https://sos2223-10.appspot.com/api/v2/economy-stats';
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
      console.log("Proxy OK");
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

}

export { vse };